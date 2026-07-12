import { Router } from "express";
import { auth, roles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/api.js";
import * as scheduleController from "../controllers/schedule.controller.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import servicesRoutes from "./services.routes.js";
import barbersRoutes from "./barbers.routes.js";
import schedulesRoutes from "./schedules.routes.js";
import appointmentsRoutes from "./appointments.routes.js";
import barberAgendaRoutes from "./barber-agenda.routes.js";
import adminRoutes from "./admin.routes.js";
import auditRoutes from "./audit.routes.js";
import reportsRoutes from "./reports.routes.js";

const router = Router();
const adminOnly = [auth, roles("ADMIN")];

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/services", servicesRoutes);
router.use("/barbers", barbersRoutes);
router.use("/schedules", schedulesRoutes);
router.get("/availability", asyncHandler(scheduleController.availability));
router.use("/appointments", appointmentsRoutes);
router.use("/barber", barberAgendaRoutes);
router.use("/admin", ...adminOnly, adminRoutes);
router.use("/audit-logs", ...adminOnly, auditRoutes);
router.use("/", ...adminOnly, reportsRoutes);

export default router;
