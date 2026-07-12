import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createAppointmentSchema = z.object({
  barberId: z.string({ required_error: "El barberId es obligatorio" }).min(1),
  serviceId: z.string({ required_error: "El serviceId es obligatorio" }).min(1),
  appointmentDate: z
    .string({ required_error: "La fecha de la cita es obligatoria" })
    .regex(dateRegex, "La fecha debe tener el formato YYYY-MM-DD"),
  startTime: z
    .string({ required_error: "La hora de inicio es obligatoria" })
    .regex(timeRegex, "La hora debe tener el formato HH:mm"),
  clientNotes: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentDate: z
    .string({ required_error: "La nueva fecha es obligatoria" })
    .regex(dateRegex, "La fecha debe tener el formato YYYY-MM-DD"),
  startTime: z
    .string({ required_error: "La nueva hora es obligatoria" })
    .regex(timeRegex, "La hora debe tener el formato HH:mm"),
  rescheduleReason: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  cancellationReason: z.string().optional(),
});

export const rejectAppointmentSchema = z.object({
  barberResponse: z.string({ required_error: "El motivo del rechazo es obligatorio" }).min(1, "El motivo del rechazo no puede estar vacío"),
});
