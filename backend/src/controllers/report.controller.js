import mongoose from "mongoose";
import path from "path";
import Report from "../models/Report.js";
import RepairProgress from "../models/RepairProgress.js";
import { MAX_IMAGES } from "../middlewares/upload.js";
import { success, created, error } from "../utils/responseFormatter.js";
import { getPagination, buildMeta } from "../utils/paginator.js";
import { removeFiles } from "../utils/file.js";
import { resolveLocation } from "../services/geoCode.js";

const STAFF_ROLES = ["admin", "petugas"];
const canManage = (user, report) =>
  STAFF_ROLES.includes(user.role) || report.reporter?.toString() === user.id;

const toImagePaths = (files = []) => files.map((f) => `uploads/reports/${f.filename}`);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const REGION_FIELDS = ["street", "village", "district", "regency", "province"];

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
    const { search, status, severity, order, today } = req.query;

    const filter = {};

    // Filter berdasarkan status laporan
    if (status) {
      filter.status = status;
    }

    // Filter berdasarkan tipe laporan
    if (type) {
      filter.type = type;
    }

    // Filter berdasarkan tingkat keparahan
    if (severity) {
      filter.severity = severity;
    }

    // Filter laporan yang dibuat hari ini
    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
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

// GET /api/reports/summary

export const getReportSummary = async (req, res, next) => {
  try {
    const { status, severity, groupBy, type } = req.query;

    if (groupBy && !REGION_FIELDS.includes(groupBy)) {
      return error(res, {
        message: `groupBy tidak valid. Pilihan: ${REGION_FIELDS.join(", ")}`,
        statusCode: 400,
      });
    }

    const match = {};

    if (status) match.status = status;
    if (severity) match.severity = severity;
    if (type) match.type = type;

    const fields = groupBy ? [groupBy] : REGION_FIELDS;

    const facets = {
      statusSummary: [
        {
          $group: {
            _id: "$status",
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            total: 1,
          },
        },
        { $sort: { status: 1 } },
      ],
    };

    fields.forEach((f) => {
      facets[f] = [
        { $match: { [f]: { $ne: null } } },
        { $group: { _id: `$${f}`, total: { $sum: 1 } } },
        { $sort: { total: -1, _id: 1 } },
        { $project: { _id: 0, name: "$_id", total: 1 } },
      ];
    });

    const [data, totalReports] = await Promise.all([
      Report.aggregate([{ $match: match }, { $facet: facets }])
        .then((r) => r[0]),
      Report.countDocuments(match),
    ]);

    return success(res, {
      message: "Ringkasan laporan berhasil diambil",
      data,
      meta: { groupBy: groupBy || null, totalReports },
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/reports
export const createReport = async (req, res, next) => {
  const images = toImagePaths(req.files);
  try {
    const body = req.body ?? {};
    const { title, description, type, severity } = body;
    const payload = {
      title,
      description,
      address: typeof body.address === "string" ? body.address.trim() : "",
      type,
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
    const [lng, lat] = location.coordinates;
    const { address: geoAddress, ...regions } = await resolveLocation(lat, lng);
    Object.assign(payload, regions);
    if (!payload.address) payload.address = geoAddress;

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

    const fields = ["title", "description", "address", "type", "severity"];
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
      const [lng, lat] = location.coordinates;
      const { address: geoAddress, ...regions } = await resolveLocation(lat, lng);
      report.set(regions);
      const addressSent = typeof body.address === "string" && body.address.trim() !== "";
      if (!addressSent) report.address = geoAddress;
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