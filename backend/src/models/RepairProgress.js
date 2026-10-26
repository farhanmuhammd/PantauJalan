import mongoose from "mongoose";
import { PROGRESS_STATUS } from "../utils/statusRule.js";

export { PROGRESS_STATUS };

// Satu dokumen = satu catatan progres perbaikan pada sebuah laporan (membentuk timeline).
const repairProgressSchema = new mongoose.Schema(
  {
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true, index: true },
    title: { type: String, required: [true, "Judul progres wajib diisi"], trim: true, maxlength: 150 },
    description: { type: String, trim: true, default: "" },
    status: { type: String, enum: PROGRESS_STATUS, default: "dikerjakan" },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String, trim: true },
  },
  { timestamps: true }
);

repairProgressSchema.index({ report: 1, createdAt: 1 });

repairProgressSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("RepairProgress", repairProgressSchema);
