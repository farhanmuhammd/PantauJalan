import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { error } from "../utils/responseFormatter.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return error(res, { message: "Token tidak ditemukan", statusCode: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      const message =
        e.name === "TokenExpiredError" ? "Sesi berakhir, silakan login ulang" : "Token tidak valid";
      return error(res, { message, statusCode: 401 });
    }

    // Ambil user dari database agar perubahan role atau akun nonaktif langsung berlaku
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return error(res, { message: "Akun tidak ditemukan atau nonaktif", statusCode: 401 });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, { message: "Anda tidak memiliki akses ke fitur ini", statusCode: 403 });
    }
    next();
  };
