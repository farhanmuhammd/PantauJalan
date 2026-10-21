import { Router } from "express";
import { uploadReportImages } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/auth.js";
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = Router();

router.get("/", getReports);
router.get("/:id", getReportById);

// authenticate sebelum upload agar request tanpa token tidak menyimpan file ke disk
router.post("/", authenticate, uploadReportImages, createReport);
router.put("/:id", authenticate, uploadReportImages, updateReport);
router.delete("/:id", authenticate, deleteReport);

export default router;
