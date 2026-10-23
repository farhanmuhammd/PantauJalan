import mongoose from "mongoose";
import path from "path";
import Report from "../models/Report.js";
import RepairProgress from "../models/RepairProgress.js";
import { MAX_IMAGES } from "../middlewares/upload.js";
import { syncReportStatus } from "../services/reportStatus.js";
import { success, created, error } from "../utils/responseFormatter.js";
import { removeFiles } from "../utils/file.js";

const toImagePaths = (files = []) => files.map((f) => `uploads/progress/${f.filename}`);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/reports/:reportId/progress  (publik) -> timeline dari yang paling lama
export const listProgress = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { search, status } = req.query;

    if (!mongoose.isValidObjectId(reportId)) {
      return error(res, {
        message: "ID laporan tidak valid",
        statusCode: 400,
      });
    }

    const report = await Report.findById(reportId).select("status");

    if (!report) {
      return error(res, {
        message: "Laporan tidak ditemukan",
        statusCode: 404,
      });
    }

    // Filter progres berdasarkan laporan
    const filter = { report: reportId };

    // Filter berdasarkan status progres
    if (status) {
      filter.status = status;
    }

    // Search berdasarkan judul dan deskripsi progres
    if (search?.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const items = await RepairProgress.find(filter)
      .sort({ createdAt: 1 });

    return success(res, {
      message: "Progres perbaikan berhasil diambil",
      data: items,
      meta: {
        reportStatus: report.status,
        totalItems: items.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/progress/:id  (publik)
export const getProgressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return error(res, { message: "ID progres tidak valid", statusCode: 400 });
    }
    const item = await RepairProgress.findById(id);
    if (!item) return error(res, { message: "Progres tidak ditemukan", statusCode: 404 });
    return success(res, { message: "Detail progres berhasil diambil", data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/reports/:reportId/progress  (admin/petugas, form-data, field images wajib minimal 1)
// Body: title (wajib), description, status (direncanakan | dikerjakan | selesai, default dikerjakan)
export const createProgress = async (req, res, next) => {
  const images = toImagePaths(req.files);
  try {
    const { reportId } = req.params;
    if (!mongoose.isValidObjectId(reportId)) {
      await removeFiles(images);
      return error(res, { message: "ID laporan tidak valid", statusCode: 400 });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      await removeFiles(images);
      return error(res, { message: "Laporan tidak ditemukan", statusCode: 404 });
    }
    if (report.status === "ditolak") {
      await removeFiles(images);
      return error(res, { message: "Laporan yang ditolak tidak dapat diberi progres", statusCode: 400 });
    }
    if (report.status === "selesai") {
      await removeFiles(images);
      return error(res, {
        message: "Laporan sudah selesai. Ubah atau hapus progres 'selesai' terlebih dahulu jika ingin membuka kembali",
        statusCode: 400,
      });
    }
    if (images.length === 0) {
      return error(res, { message: "Foto bukti wajib diunggah (minimal 1, field images)", statusCode: 422 });
    }

    const body = req.body ?? {};
    const item = await RepairProgress.create({
      report: report._id,
      title: body.title,
      description: body.description,
      status: body.status || undefined,
      images,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    const reportStatus = await syncReportStatus(report._id);
    return created(res, {
      message:
        reportStatus === "selesai"
          ? "Progres dicatat. Perbaikan selesai, status laporan otomatis menjadi selesai"
          : "Progres perbaikan berhasil dicatat",
      data: { progress: item, reportStatus },
    });
  } catch (err) {
    await removeFiles(images);
    next(err);
  }
};

// PUT /api/progress/:id  (admin/petugas) - Body opsional: title, description, status, removeImages
export const updateProgress = async (req, res, next) => {
  const newImages = toImagePaths(req.files);
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      await removeFiles(newImages);
      return error(res, { message: "ID progres tidak valid", statusCode: 400 });
    }
    const item = await RepairProgress.findById(id);
    if (!item) {
      await removeFiles(newImages);
      return error(res, { message: "Progres tidak ditemukan", statusCode: 404 });
    }

    const body = req.body ?? {};
    let removeList = body.removeImages || [];
    if (!Array.isArray(removeList)) removeList = [removeList];
    const removeNames = removeList.map((p) => path.basename(String(p)));
    const toRemove = item.images.filter((p) => removeNames.includes(path.basename(p)));
    const remaining = item.images.filter((p) => !toRemove.includes(p));

    const total = remaining.length + newImages.length;
    if (total > MAX_IMAGES) {
      await removeFiles(newImages);
      return error(res, { message: `Total foto maksimal ${MAX_IMAGES}`, statusCode: 400 });
    }
    if (total < 1) {
      await removeFiles(newImages);
      return error(res, { message: "Setiap progres harus memiliki minimal 1 foto bukti", statusCode: 422 });
    }

    ["title", "description", "status"].forEach((f) => {
      if (body[f] !== undefined) item[f] = body[f];
    });
    item.images = [...remaining, ...newImages];
    await item.save();
    await removeFiles(toRemove); // hapus file lama setelah data tersimpan

    const reportStatus = await syncReportStatus(item.report);
    return success(res, {
      message: "Progres perbaikan berhasil diperbarui",
      data: { progress: item, reportStatus },
    });
  } catch (err) {
    await removeFiles(newImages);
    next(err);
  }
};

// DELETE /api/progress/:id  (admin/petugas)
export const deleteProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return error(res, { message: "ID progres tidak valid", statusCode: 400 });
    }
    const item = await RepairProgress.findById(id);
    if (!item) return error(res, { message: "Progres tidak ditemukan", statusCode: 404 });

    await item.deleteOne();
    await removeFiles(item.images);

    const reportStatus = await syncReportStatus(item.report);
    return success(res, {
      message: "Progres perbaikan berhasil dihapus",
      data: { reportStatus },
    });
  } catch (err) {
    next(err);
  }
};
