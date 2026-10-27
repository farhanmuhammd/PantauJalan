import mongoose from "mongoose";
import { SEVERITY, STATUS, REPORT_TYPES } from "../utils/statusRule.js";

export { SEVERITY, STATUS, REPORT_TYPES };

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Judul wajib diisi"], trim: true, maxlength: 150 },
    description: { type: String, required: [true, "Deskripsi wajib diisi"], trim: true },
    address: { type: String, trim: true, default: null },
    street: { type: String, trim: true, default: null },
    village: { type: String, trim: true, default: null },
    district: { type: String, trim: true, default: null },
    regency: { type: String, trim: true, default: null },
    province: { type: String, trim: true, default: null },
    type: { type: String, enum: REPORT_TYPES, default: "lainnya" },
    severity: { type: String, enum: SEVERITY, default: "ringan" },
    status: { type: String, enum: STATUS, default: "menunggu" },
    cost: { type: Number, min: [0, "Total biaya tidak boleh negatif"], default: 0 },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
          resource_type: {
            type: String,
            enum: ["image", "video", "raw"],
            default: "image",
          },
          format: { type: String, default: null },
          original_filename: { type: String, default: null },
        },
      ],
      default: [],
    },
    // GeoJSON Point, disimpan sebagai [lng, lat]. Dikirim dari FE (latitude dan longitude).
    // Wajib saat membuat laporan baru (dicek di controller agar data lama tanpa lokasi tetap bisa disimpan).
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: {
        type: [Number],
        default: undefined,
        validate: {
          validator: (v) =>
            v == null ||
            (v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90),
          message: "Koordinat tidak valid",
        },
      },
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ province: 1, regency: 1, district: 1, village: 1, street: 1 });

reportSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Report", reportSchema);
