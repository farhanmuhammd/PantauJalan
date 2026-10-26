import multer from "multer";

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
