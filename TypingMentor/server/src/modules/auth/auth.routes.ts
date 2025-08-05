import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validation.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authRateLimiter, validate(registerSchema), authController.register);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
