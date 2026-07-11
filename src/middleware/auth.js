import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError, asyncHandler } from "../utils/api.js";

export const auth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new ApiError("Token no proporcionado", 401);
  let decoded;
  try { decoded = jwt.verify(header.slice(7), env.jwtSecret); } catch { throw new ApiError("Token invalido o expirado", 401); }
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError("Usuario no encontrado", 401);
  if (user.status !== "ACTIVE") throw new ApiError("La cuenta no esta activa", 403);
  req.user = user;
  next();
});

export const roles = (...allowed) => (req, _res, next) => {
  if (!req.user) return next(new ApiError("Usuario no autenticado", 401));
  if (!allowed.includes(req.user.role)) return next(new ApiError("No tienes permisos para realizar esta accion", 403));
  next();
};
