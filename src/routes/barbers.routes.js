import { Router } from "express";
import * as barberController from "../controllers/barber.controller.js";
import * as scheduleController from "../controllers/schedule.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.get("/", wrap(barberController.listBarbers));
router.get("/:id/services", wrap(barberController.getBarberServices));
router.get("/:id/availability", wrap(barberController.getBarberAvailability));
router.get("/:barberId/schedules", wrap(barberController.getBarberSchedules));
router.get("/:id", wrap(barberController.getBarber));
router.post("/", auth, roles("ADMIN"), wrap(barberController.createBarber));
router.put("/:id", auth, roles("ADMIN"), wrap(barberController.updateBarber));
router.patch("/:id/status", auth, roles("ADMIN"), wrap(barberController.setBarberStatus));
router.patch("/:id/services", auth, roles("ADMIN"), wrap(barberController.setBarberServices));
router.delete("/:id", auth, roles("ADMIN"), wrap(barberController.removeBarber));
router.put("/:barberId/schedules/:dayOfWeek", auth, roles("ADMIN"), wrap(scheduleController.upsertBarberSchedule));

export default router;
