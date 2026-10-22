import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import reportRoutes from "./routes/report.routes.js";
import routeRoutes from "./routes/route.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { success } from "./utils/responseFormatter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 

// Gambar bisa diakses lewat http://localhost:5000/uploads/reports/namafile.jpg
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => success(res, { message: "PantauJalan API berjalan" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/routes", routeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
