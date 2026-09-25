import { Router } from "express";
import { resultController } from "./result.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { submitResultSchema, historyQuerySchema } from "./result.validation.js";

const router = Router();

router.post("/", requireAuth, validate(submitResultSchema), resultController.submit);
router.get(
  "/history",
  requireAuth,
  validate(historyQuerySchema, "query"),
  resultController.history
);

export default router;
