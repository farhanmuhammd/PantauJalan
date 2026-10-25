import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  app.use(async (_req, _res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      next(error);
    }
  });
}

if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Gagal terhubung ke MongoDB:", err.message);
      process.exit(1);
    });
}

export default app;