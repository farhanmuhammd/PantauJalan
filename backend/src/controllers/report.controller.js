import mongoose from "mongoose";
import path from "path";
import Report from "../models/Report.js";
import RepairProgress from "../models/RepairProgress.js";
import { MAX_IMAGES } from "../middlewares/upload.js";
import { success, created, error } from "../utils/responseFormatter.js";
import { getPagination, buildMeta } from "../utils/paginator.js";
import { removeFiles } from "../utils/file.js";
import { resolveAddress } from "../services/geoCode.js";

const STAFF_ROLES = ["admin", "petugas"];
const canManage = (user, report) =>
  STAFF_ROLES.includes(user.role) || report.reporter?.toString() === user.id;

const toImagePaths = (files = []) => files.map((f) => `uploads/reports/${f.filename}`);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Mengubah latitude dan longitude dari body (string) menjadi GeoJSON Point.
// Mengembalikan: GeoJSON Point jika valid, null jika tidak dikirim/bukan angka, undefined jika di luar rentang.
const toCoord = (v) => (v === undefined || v === null || String(v).trim() === "" ? NaN : Number(v));
const buildLocation = (body) => {
  const lat = toCoord(body.latitude);
  const lng = toCoord(body.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return undefined; // di luar rentang
  return { type: "Point", coordinates: [lng, lat] };
};

// GET /api/reports
export const getReports = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, status, severity, order } = req.query;

    const filter = {};

    // Filter berdasarkan status laporan
    if (status) {
      filter.status = status;
    }

    // Filter berdasarkan tingkat keparahan
    if (severity) {
      filter.severity = severity;
    }

    // Pencarian berdasarkan judul, deskripsi, dan alamat
    if (search?.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { title: regex },
        { description: regex },
        { address: regex },
      ];
    }

    // Urutkan berdasarkan waktu pembuatan
    const sort = {
      createdAt: order === "asc" ? 1 : -1,
    };

    const [items, totalItems] = await Promise.all([
      Report.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Report.countDocuments(filter),
    ]);

    return success(res, {
      message: "Daftar laporan berhasil diambil",
      data: items,
      meta: buildMeta({ page, limit, totalItems }),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/:id
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return error(res, { message: "ID laporan tidak valid", statusCode: 400 });
    }
    const report = await Report.findById(id);
    if (!report) return error(res, { message: "Laporan tidak ditemukan", statusCode: 404 });

    return success(res, { message: "Detail laporan berhasil diambil", data: report });
  } catch (err) {
    next(err);
  }
};

// POST /api/reports
export const createReport = async (req, res, next) => {
  const images = toImagePaths(req.files);
  try {
    const body = req.body ?? {};
    const { title, description, severity } = body;
    const payload = {
      title,
      description,
      address: typeof body.address === "string" ? body.address.trim() : "",
      severity,
      images,
    };

    // Lokasi dikirim dari FE (latitude dan longitude) dan wajib ada, karena dipakai untuk peta dan rute.
    const location = buildLocation(body);
    if (!location) {
      await removeFiles(images);
      return error(res, {
        message:
          location === null
            ? "Latitude dan longitude wajib diisi (angka)"
            : "Koordinat tidak valid",
        statusCode: 422,
      });
    }
    payload.location = location;

    // Alamat opsional: jika FE tidak mengirim address, isi otomatis dari koordinat (reverse geocoding OSM).
    if (!payload.address) {
      const [lng, lat] = location.coordinates;
      payload.address = await resolveAddress(lat, lng);
    }

    const report = await Report.create(payload);
    return created(res, { message: "Laporan berhasil dibuat", data: report });
  } catch (err) {
    await removeFiles(images); // bersihkan file jika gagal simpan
    next(err);
  }
};

// PUT /api/reports/:id
// Body opsional: removeImages (nama file atau path gambar lama yang ingin dihapus)
export const updateReport = async (req, res, next) => {
  const newImages = toImagePaths(req.files);
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      await removeFiles(newImages);
      return error(res, { message: "ID laporan tidak valid", statusCode: 400 });
    }

    const report = await Report.findById(id);
    if (!report) {
      await removeFiles(newImages);
      return error(res, { message: "Laporan tidak ditemukan", statusCode: 404 });
    }

    if (!canManage(req.user, report)) {
      await removeFiles(newImages);
      return error(res, { message: "Anda tidak berhak mengubah laporan ini", statusCode: 403 });
    }

    const body = req.body ?? {};

    // Status "selesai" hanya boleh lewat progres perbaikan (wajib ada foto bukti), lihat progress.controller.js
    if (body.status === "selesai" && report.status !== "selesai" && STAFF_ROLES.includes(req.user.role)) {
      await removeFiles(newImages);
      return error(res, {
        message: "Status selesai diatur otomatis saat progres perbaikan berstatus selesai (dengan foto bukti)",
        statusCode: 400,
      });
    }

    // Tentukan gambar lama yang dihapus
    let removeList = body.removeImages || [];
    if (!Array.isArray(removeList)) removeList = [removeList];
    const removeNames = removeList.map((p) => path.basename(p));
    const toRemove = report.images.filter((p) => removeNames.includes(path.basename(p)));
    const remaining = report.images.filter((p) => !toRemove.includes(p));

    if (remaining.length + newImages.length > MAX_IMAGES) {
      await removeFiles(newImages);
      return error(res, { message: `Total gambar maksimal ${MAX_IMAGES}`, statusCode: 400 });
    }

    const fields = ["title", "description", "address", "severity"];
    if (STAFF_ROLES.includes(req.user.role)) fields.push("status");
    fields.forEach((f) => {
      if (body[f] !== undefined) report[f] = body[f];
    });

    if (body.latitude !== undefined || body.longitude !== undefined) {
      const location = buildLocation(body);
      if (!location) {
        await removeFiles(newImages);
        return error(res, { message: "Koordinat tidak valid", statusCode: 422 });
      }
      report.location = location;

      // Lokasi berubah dan address tidak ikut dikirim: perbarui alamat dari koordinat baru.
      const addressSent = typeof body.address === "string" && body.address.trim() !== "";
      if (!addressSent) {
        const [lng, lat] = location.coordinates;
        report.address = await resolveAddress(lat, lng);
      }
    }

    report.images = [...remaining, ...newImages];
    await report.save();
    await removeFiles(toRemove); // hapus file lama setelah data tersimpan

    return success(res, { message: "Laporan berhasil diperbarui", data: report });
  } catch (err) {
    await removeFiles(newImages);
    next(err);
  }
};

// DELETE /api/reports/:id
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return error(res, { message: "ID laporan tidak valid", statusCode: 400 });
    }
    const report = await Report.findById(id);
    if (!report) return error(res, { message: "Laporan tidak ditemukan", statusCode: 404 });

    if (!canManage(req.user, report)) {
      return error(res, { message: "Anda tidak berhak menghapus laporan ini", statusCode: 403 });
    }

    const progress = await RepairProgress.find({ report: report._id }).select("images");
    await report.deleteOne();
    await RepairProgress.deleteMany({ report: report._id });
    await removeFiles([...report.images, ...progress.flatMap((p) => p.images)]);
    return success(res, { message: "Laporan berhasil dihapus", data: null });
  } catch (err) {
    next(err);
  }
};