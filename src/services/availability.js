import Appointment from "../models/Appointment.js";
import BarberProfile from "../models/BarberProfile.js";
import Schedule from "../models/Schedule.js";
import Service from "../models/Service.js";
import { ApiError } from "../utils/api.js";
import { DAYS, addMinutes, dateOnly, localDateString, overlaps, timeToMinutes } from "../utils/time.js";

export const validateAppointmentSlot = async ({ barberId, serviceId, date, startTime, excludeId }) => {
  const [barber, service] = await Promise.all([
    BarberProfile.findById(barberId).populate("userId"),
    Service.findById(serviceId),
  ]);
  if (!barber || !barber.userId || barber.userId.status !== "ACTIVE" || !barber.isAvailable) throw new ApiError("El barbero no esta disponible", 404);
  if (!service || service.status !== "ACTIVE") throw new ApiError("El servicio no esta activo", 404);
  if (!barber.serviceIds.some((id) => id.equals(service._id))) throw new ApiError("El barbero no ofrece este servicio", 400);

  const appointmentDate = dateOnly(date);
  const now = new Date();
  const today = localDateString(now);
  const maximum = new Date(); maximum.setDate(maximum.getDate() + 30); maximum.setHours(0, 0, 0, 0);
  if (date < today || appointmentDate > maximum) throw new ApiError("La cita debe estar entre hoy y los proximos 30 dias");
  if (date === today && timeToMinutes(startTime) <= now.getHours() * 60 + now.getMinutes()) throw new ApiError("No se permiten citas en horas pasadas");

  const schedule = await Schedule.findOne({ barberId, dayOfWeek: DAYS[appointmentDate.getDay()] });
  if (!schedule?.isWorkingDay) throw new ApiError("El barbero no trabaja el dia seleccionado");
  const endTime = addMinutes(startTime, service.durationMinutes);
  if (timeToMinutes(startTime) < timeToMinutes(schedule.startTime) || timeToMinutes(endTime) > timeToMinutes(schedule.endTime)) throw new ApiError("La cita esta fuera de la jornada laboral");
  if (schedule.breakStartTime && overlaps(startTime, endTime, schedule.breakStartTime, schedule.breakEndTime)) throw new ApiError("La cita coincide con el descanso del barbero");

  const filter = { barberId, appointmentDate, status: { $in: ["PENDING", "APPROVED"] } };
  if (excludeId) filter._id = { $ne: excludeId };
  const appointments = await Appointment.find(filter);
  if (appointments.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime))) throw new ApiError("El barbero no esta disponible en el horario seleccionado", 409);
  return { barber, service, appointmentDate, endTime, schedule };
};

export const availableSlots = async ({ barberId, serviceId, date }) => {
  const { service, appointmentDate, schedule } = await validateBase({ barberId, serviceId, date });
  if (!schedule?.isWorkingDay) return [];
  const appointments = await Appointment.find({ barberId, appointmentDate, status: { $in: ["PENDING", "APPROVED"] } });
  const slots = [];
  const duration = service.durationMinutes;
  for (let minute = timeToMinutes(schedule.startTime); minute + duration <= timeToMinutes(schedule.endTime); minute += duration) {
    const start = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
    const end = addMinutes(start, duration);
    if (schedule.breakStartTime && overlaps(start, end, schedule.breakStartTime, schedule.breakEndTime)) continue;
    if (appointments.some((item) => overlaps(start, end, item.startTime, item.endTime))) continue;
    if (date === localDateString() && minute <= new Date().getHours() * 60 + new Date().getMinutes()) continue;
    slots.push(start);
  }
  return slots;
};

const validateBase = async ({ barberId, serviceId, date }) => {
  const [barber, service] = await Promise.all([BarberProfile.findById(barberId).populate("userId"), Service.findById(serviceId)]);
  if (!barber || barber.userId?.status !== "ACTIVE" || !barber.isAvailable) throw new ApiError("Barbero no disponible", 404);
  if (!service || service.status !== "ACTIVE") throw new ApiError("Servicio no disponible", 404);
  if (!barber.serviceIds.some((id) => id.equals(service._id))) throw new ApiError("El barbero no ofrece este servicio");
  const appointmentDate = dateOnly(date);
  const schedule = await Schedule.findOne({ barberId, dayOfWeek: DAYS[appointmentDate.getDay()] });
  return { barber, service, appointmentDate, schedule };
};
