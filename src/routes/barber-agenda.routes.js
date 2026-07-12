import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/api.js";
import { rejectAppointmentSchema } from "../schemas/appointment.schemas.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.get("/appointments", auth, roles("BARBER"), wrap(appointmentController.barberAppointments));
router.patch("/appointments/:id/approve", auth, roles("BARBER", "ADMIN"), wrap(appointmentController.approve));
router.patch("/appointments/:id/reject", auth, roles("BARBER", "ADMIN"), validate(rejectAppointmentSchema), wrap(appointmentController.reject));
router.patch("/appointments/:id/complete", auth, roles("BARBER", "ADMIN"), wrap(appointmentController.complete));
router.patch("/appointments/:id/no-show", auth, roles("BARBER", "ADMIN"), wrap(appointmentController.noShow));

export default router;
