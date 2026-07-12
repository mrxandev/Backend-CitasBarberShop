import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

// Mounted at /admin — all callers must apply auth + roles("ADMIN")
router.get("/appointments", wrap(appointmentController.adminAppointments));
router.get("/appointments/:id", wrap(appointmentController.adminGetAppointment));
router.patch("/appointments/:id/reassign", wrap(appointmentController.reassign));
router.patch("/appointments/:id/status", wrap(appointmentController.adminStatus));
router.patch("/appointments/:id/cancel", wrap(appointmentController.cancelAppointment));

export default router;
