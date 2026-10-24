import mongoose from "mongoose";
import { SEVERITY, STATUS } from "../utils/statusRule.js";

export { SEVERITY, STATUS };

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
    severity: { type: String, enum: SEVERITY, default: "ringan" },
    status: { type: String, enum: STATUS, default: "menunggu" },
    images: { type: [String], default: [] },

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
    ret.images = (ret.images || []).map((p) => `${process.env.BASE_URL}/${p}`);
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Report", reportSchema);
