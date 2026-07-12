import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/api.js";
import { cancelAppointmentSchema, createAppointmentSchema, rejectAppointmentSchema, rescheduleAppointmentSchema } from "../schemas/appointment.schemas.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

// Client routes
router.post("/", auth, roles("CLIENT", "ADMIN"), validate(createAppointmentSchema), wrap(appointmentController.createAppointment));
router.get("/my-appointments", auth, roles("CLIENT"), wrap(appointmentController.myAppointments));
router.patch("/:id/cancel", auth, validate(cancelAppointmentSchema), wrap(appointmentController.cancelAppointment));
router.patch("/:id/reschedule", auth, roles("CLIENT"), validate(rescheduleAppointmentSchema), wrap(appointmentController.rescheduleAppointment));
router.get("/:id", auth, wrap(appointmentController.getAppointment));

export default router;
