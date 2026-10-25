
import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Environment variable MONGO_URI belum tersedia");
  }

  console.log("Memulai koneksi MongoDB...");
  console.log("Status awal Mongoose:", mongoose.connection.readyState);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB terhubung:", mongoose.connection.host);
    console.log("Status koneksi Mongoose:", mongoose.connection.readyState);
  } catch (error) {
    console.error("Koneksi MongoDB gagal:", error.message);
    throw error;
  }
};
