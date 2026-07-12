import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

// Mounted at /audit-logs — all callers must apply auth + roles("ADMIN")
router.get("/", wrap(adminController.auditLogs));
router.get("/user/:userId", wrap(adminController.userAuditLogs));
router.get("/:id", wrap(adminController.auditLog));

export default router;
