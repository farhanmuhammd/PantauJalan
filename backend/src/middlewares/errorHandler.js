import multer from "multer";
import { error } from "../utils/responseFormatter.js";

export const notFound = (req, res) =>
  error(res, { message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`, statusCode: 404 });

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const map = {
      LIMIT_FILE_SIZE: "Ukuran gambar maksimal 5 MB",
      LIMIT_FILE_COUNT: "Jumlah gambar maksimal 5",
      LIMIT_UNEXPECTED_FILE: "File harus berupa gambar JPG, PNG, atau WEBP pada field images",
    };
    return error(res, { message: map[err.code] || err.message, statusCode: 400 });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return error(res, { message: "Validasi gagal", statusCode: 422, errors });
  }

  if (err.name === "CastError") {
    return error(res, { message: `Nilai ${err.path} tidak valid`, statusCode: 400 });
  }

  if (err.code === 11000) {
    return error(res, { message: "Data sudah terdaftar", statusCode: 409 });
  }

  console.error(err);
  return error(res, { message: err.message || "Terjadi kesalahan pada server" });
};
