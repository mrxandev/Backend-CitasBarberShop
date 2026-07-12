import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/api.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../schemas/auth.schemas.js";

const router = Router();
const wrap = (fn) => asyncHandler(fn);

router.post("/register", validate(registerSchema), wrap(authController.register));
router.post("/login", validate(loginSchema), wrap(authController.login));
router.get("/me", auth, wrap(authController.me));
router.patch("/change-password", auth, validate(changePasswordSchema), wrap(authController.changePassword));

export default router;
