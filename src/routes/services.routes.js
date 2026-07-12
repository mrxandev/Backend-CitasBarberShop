import { Router } from "express";
import * as serviceController from "../controllers/service.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.get("/", wrap(serviceController.listServices));
router.get("/:id", wrap(serviceController.getService));
router.post("/", auth, roles("ADMIN"), wrap(serviceController.createService));
router.put("/:id", auth, roles("ADMIN"), wrap(serviceController.updateService));
router.patch("/:id/status", auth, roles("ADMIN"), wrap(serviceController.setServiceStatus));
router.delete("/:id", auth, roles("ADMIN"), wrap(serviceController.removeService));

export default router;
