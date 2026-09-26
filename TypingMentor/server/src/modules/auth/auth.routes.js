import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  googleAuthSchema,
} from "./auth.validation.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authRateLimiter, validate(registerSchema), authController.register);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-verification", authRateLimiter, validate(resendVerificationSchema), authController.resendVerification);
router.post("/google", authRateLimiter, validate(googleAuthSchema), authController.googleLogin);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
