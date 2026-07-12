import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

// Mounted at / — all callers must apply auth + roles("ADMIN")
router.get("/dashboard/summary", wrap(adminController.dashboard));
router.get("/reports/appointments-by-status", wrap(adminController.appointmentsByStatus));
router.get("/reports/popular-services", wrap(adminController.popularServices));
router.get("/reports/appointments-by-barber", wrap(adminController.appointmentsByBarber));
router.get("/reports/appointments-by-date", wrap(adminController.appointmentsByDate));
router.get("/reports/estimated-revenue", wrap(adminController.estimatedRevenue));

export default router;
