import { Router } from "express";
import { feedbackController } from "./feedback.controller.js";
import { createFeedbackSchema } from "./feedback.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/cooldown", requireAuth, feedbackController.getCooldownStatus);
router.post("/", requireAuth, validate(createFeedbackSchema), feedbackController.submitFeedback);

export const feedbackRoutes = router;
