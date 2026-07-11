import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ApiError, ok, paginated, pagination } from "../utils/api.js";
import { audit } from "../utils/audit.js";

export const updateMe = async (req, res) => {
  const allowed = ["firstName", "lastName", "phone"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  return ok(res, "Perfil actualizado", { user: req.user });
};
export const listUsers = async (req, res) => {
  const { page, limit, skip } = pagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  const [data, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return paginated(res, data, total, page, limit);
};
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("Usuario no encontrado", 404);
  return ok(res, "Usuario obtenido", { user });
};
export const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role = "CLIENT",
    status = "ACTIVE",
  } = req.body;
  if (!["CLIENT", "BARBER", "ADMIN"].includes(role))
    throw new ApiError("Rol no valido");
  if (!password || password.length < 8)
    throw new ApiError("La contrasena debe tener al menos 8 caracteres");
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    role,
    status,
    password: await bcrypt.hash(password, 10),
  });
  await audit({
    req,
    action: "USER_CREATED",
    entity: "USER",
    entityId: user._id,
    description: "Usuario creado por administrador",
    newData: user.toJSON(),
  });
  return ok(res, "Usuario creado", { user }, 201);
};
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("Usuario no encontrado", 404);
  const previousData = user.toJSON();
  ["firstName", "lastName", "phone"].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  await user.save();
  await audit({
    req,
    action: "USER_UPDATED",
    entity: "USER",
    entityId: user._id,
    description: "Usuario actualizado",
    previousData,
    newData: user.toJSON(),
  });
  return ok(res, "Usuario actualizado", { user });
};
export const setStatus = async (req, res) =>
  setField(
    req,
    res,
    "status",
    ["ACTIVE", "INACTIVE", "SUSPENDED"],
    "USER_STATUS_CHANGED",
  );
export const setRole = async (req, res) =>
  setField(
    req,
    res,
    "role",
    ["CLIENT", "BARBER", "ADMIN"],
    "USER_ROLE_CHANGED",
  );
const setField = async (req, res, field, values, action) => {
  if (!values.includes(req.body[field]))
    throw new ApiError(`${field} no valido`);
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("Usuario no encontrado", 404);
  const previousData = { [field]: user[field] };
  user[field] = req.body[field];
  await user.save();
  await audit({
    req,
    action,
    entity: "USER",
    entityId: user._id,
    description: `${field} actualizado`,
    previousData,
    newData: { [field]: user[field] },
  });
  return ok(res, "Usuario actualizado", { user });
};
export const removeUser = async (req, res) => {
  req.body.status = "INACTIVE";
  return setStatus(req, res);
};
