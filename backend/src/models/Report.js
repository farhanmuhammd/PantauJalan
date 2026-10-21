import mongoose from "mongoose";

export const SEVERITY = ["ringan", "sedang", "berat"];
export const STATUS = ["menunggu", "diverifikasi", "diproses", "selesai", "ditolak"];

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Judul wajib diisi"], trim: true, maxlength: 150 },
    description: { type: String, required: [true, "Deskripsi wajib diisi"], trim: true },
    address: { type: String, required: [true, "Alamat wajib diisi"], trim: true },
    reporterName: { type: String, trim: true, default: "Anonim" },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    severity: { type: String, enum: SEVERITY, default: "ringan" },
    status: { type: String, enum: STATUS, default: "menunggu" },
    images: { type: [String], default: [] },

    // GeoJSON Point, disimpan sebagai [lng, lat]. Opsional dulu, dipakai saat fitur peta dibuat.
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], default: undefined },
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });
reportSchema.index({ createdAt: -1 });

reportSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.images = (ret.images || []).map((p) => `${process.env.BASE_URL}/${p}`);
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Report", reportSchema);
