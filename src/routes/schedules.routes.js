import { Router } from "express";
import * as scheduleController from "../controllers/schedule.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.get("/", auth, roles("ADMIN"), wrap(scheduleController.listSchedules));
router.get("/:id", auth, roles("ADMIN"), wrap(scheduleController.getSchedule));
router.post("/", auth, roles("ADMIN"), wrap(scheduleController.createSchedule));
router.put("/:id", auth, roles("ADMIN"), wrap(scheduleController.updateSchedule));
router.patch("/:id/status", auth, roles("ADMIN"), wrap(scheduleController.setScheduleStatus));
router.delete("/:id", auth, roles("ADMIN"), wrap(scheduleController.removeSchedule));

export default router;
