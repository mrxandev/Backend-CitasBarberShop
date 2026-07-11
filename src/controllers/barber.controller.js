import BarberProfile from "../models/BarberProfile.js";
import Schedule from "../models/Schedule.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { availableSlots } from "../services/availability.js";
import { ApiError, ok } from "../utils/api.js";
import { audit } from "../utils/audit.js";

export const listBarbers = async (req, res) => {
  const filter = {};
  if (req.query.available !== undefined)
    filter.isAvailable = req.query.available === "true";
  if (req.query.serviceId) filter.serviceIds = req.query.serviceId;
  let barbers = await BarberProfile.find(filter)
    .populate("userId", "firstName lastName email phone status")
    .populate("serviceIds");
  barbers = barbers.filter(
    (item) =>
      item.userId?.status === "ACTIVE" &&
      (!req.query.search ||
        `${item.userId.firstName} ${item.userId.lastName}`
          .toLowerCase()
          .includes(req.query.search.toLowerCase())),
  );
  return ok(res, "Barberos obtenidos", { barbers });
};
export const getBarber = async (req, res) => {
  const barber = await BarberProfile.findById(req.params.id)
    .populate("userId", "firstName lastName email phone status")
    .populate("serviceIds");
  if (!barber) throw new ApiError("Barbero no encontrado", 404);
  return ok(res, "Barbero obtenido", { barber });
};
export const getBarberServices = async (req, res) => {
  const barber = await BarberProfile.findById(req.params.id).populate(
    "serviceIds",
  );
  if (!barber) throw new ApiError("Barbero no encontrado", 404);
  return ok(res, "Servicios obtenidos", { services: barber.serviceIds });
};
export const getBarberSchedules = async (req, res) =>
  ok(res, "Horarios obtenidos", {
    schedules: await Schedule.find({ barberId: req.params.barberId }).sort({
      dayOfWeek: 1,
    }),
  });
export const getBarberAvailability = async (req, res) => {
  const slots = await availableSlots({
    barberId: req.params.id,
    serviceId: req.query.serviceId,
    date: req.query.date,
  });
  return ok(res, "Disponibilidad obtenida", {
    date: req.query.date,
    barberId: req.params.id,
    serviceId: req.query.serviceId,
    availableSlots: slots,
  });
};
export const createBarber = async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user || user.role !== "BARBER")
    throw new ApiError("El usuario debe existir y tener rol BARBER");
  const services = await Service.countDocuments({
    _id: { $in: req.body.serviceIds || [] },
  });
  if (services !== (req.body.serviceIds || []).length)
    throw new ApiError("Uno o mas servicios no existen");
  const barber = await BarberProfile.create(req.body);
  await audit({
    req,
    action: "BARBER_CREATED",
    entity: "BARBER",
    entityId: barber._id,
    description: "Perfil de barbero creado",
    newData: barber.toJSON(),
  });
  return ok(res, "Barbero creado", { barber }, 201);
};
export const updateBarber = async (req, res) => {
  const barber = await BarberProfile.findById(req.params.id);
  if (!barber) throw new ApiError("Barbero no encontrado", 404);
  const previousData = barber.toJSON();
  ["specialty", "biography", "yearsOfExperience"].forEach((field) => {
    if (req.body[field] !== undefined) barber[field] = req.body[field];
  });
  await barber.save();
  await audit({
    req,
    action: "BARBER_UPDATED",
    entity: "BARBER",
    entityId: barber._id,
    description: "Perfil de barbero actualizado",
    previousData,
    newData: barber.toJSON(),
  });
  return ok(res, "Barbero actualizado", { barber });
};
export const setBarberStatus = async (req, res) => {
  const barber = await BarberProfile.findByIdAndUpdate(
    req.params.id,
    { isAvailable: Boolean(req.body.isAvailable) },
    { new: true },
  );
  if (!barber) throw new ApiError("Barbero no encontrado", 404);
  return ok(res, "Disponibilidad actualizada", { barber });
};
export const setBarberServices = async (req, res) => {
  const serviceIds = req.body.serviceIds || [];
  if (
    (await Service.countDocuments({ _id: { $in: serviceIds } })) !==
    serviceIds.length
  )
    throw new ApiError("Uno o mas servicios no existen");
  const barber = await BarberProfile.findByIdAndUpdate(
    req.params.id,
    { serviceIds },
    { new: true },
  ).populate("serviceIds");
  if (!barber) throw new ApiError("Barbero no encontrado", 404);
  return ok(res, "Servicios asignados", { barber });
};
export const removeBarber = async (req, res) => {
  req.body.isAvailable = false;
  return setBarberStatus(req, res);
};
