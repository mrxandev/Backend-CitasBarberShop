import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as userController from "../controllers/user.controller.js";
import { auth, roles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.get("/me", auth, wrap(authController.me));
router.patch("/me", auth, wrap(userController.updateMe));
router.get("/", auth, roles("ADMIN"), wrap(userController.listUsers));
router.post("/", auth, roles("ADMIN"), wrap(userController.createUser));
router.get("/:id", auth, roles("ADMIN"), wrap(userController.getUser));
router.put("/:id", auth, roles("ADMIN"), wrap(userController.updateUser));
router.patch("/:id/status", auth, roles("ADMIN"), wrap(userController.setStatus));
router.patch("/:id/role", auth, roles("ADMIN"), wrap(userController.setRole));
router.delete("/:id", auth, roles("ADMIN"), wrap(userController.removeUser));

export default router;
