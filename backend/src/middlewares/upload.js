import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";
import crypto from "crypto";

export const MAX_IMAGES = 5;

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const fileFilter = (_req, file, cb) => {
  if (EXT_BY_MIME[file.mimetype]) {
    return cb(null, true);
  }

  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "images"));
};

const createImageUploader = (folder) => {
  const dir = path.join(os.tmpdir(), "uploads", folder);

  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const name = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${EXT_BY_MIME[file.mimetype]}`;
      cb(null, name);
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: MAX_IMAGES,
    },
  }).array("images", MAX_IMAGES);
};

export const uploadReportImages = createImageUploader("reports");
export const uploadProgressImages = createImageUploader("progress");
