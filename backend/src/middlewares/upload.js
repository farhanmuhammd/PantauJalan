import multer from "multer";

export const MAX_IMAGES = 5;

const ALLOWED_MIME_TYPES = [
  // Gambar
  "image/jpeg",
  "image/png",
  "image/webp",

  // Dokumen
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Video
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/3gpp",
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error(
    `Format file tidak didukung: ${file.mimetype}`,
  );

  error.statusCode = 400;
  return cb(error);
};

const createImageUploader = () =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: MAX_IMAGES,
    },
  }).array("images", MAX_IMAGES);

export const uploadReportImages = createImageUploader();
export const uploadProgressImages = createImageUploader();
