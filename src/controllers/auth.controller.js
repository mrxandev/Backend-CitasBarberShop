import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { ApiError, ok } from "../utils/api.js";
import { audit } from "../utils/audit.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !password) throw new ApiError("Nombre, apellido, correo, telefono y contrasena son obligatorios");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError("El correo no es valido");
  if (password.length < 8) throw new ApiError("La contrasena debe tener al menos 8 caracteres");
  if (await User.exists({ email: email.toLowerCase() })) throw new ApiError("El correo ya esta registrado", 409);
  const user = await User.create({ firstName, lastName, email, phone, password: await bcrypt.hash(password, 10), role: "CLIENT" });
  await audit({ req: { ...req, user }, action: "USER_REGISTERED", entity: "USER", entityId: user._id, description: "Cliente registrado", newData: user.toJSON() });
  return ok(res, "Usuario registrado correctamente", { user }, 201);
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || "").toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) throw new ApiError("Credenciales invalidas", 401);
  if (user.status !== "ACTIVE") throw new ApiError("La cuenta no esta activa", 403);
  const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  await audit({ req: { ...req, user }, action: "USER_LOGIN", entity: "USER", entityId: user._id, description: "Inicio de sesion" });
  user.password = undefined;
  return ok(res, "Inicio de sesion correcto", { token, user });
};
export const me = async (req, res) => ok(res, "Perfil obtenido correctamente", { user: req.user });
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await bcrypt.compare(req.body.currentPassword || "", user.password))) throw new ApiError("La contrasena actual no es correcta", 401);
  if (!req.body.newPassword || req.body.newPassword.length < 8) throw new ApiError("La nueva contrasena debe tener al menos 8 caracteres");
  user.password = await bcrypt.hash(req.body.newPassword, 10); await user.save();
  return ok(res, "Contrasena actualizada correctamente");
};
