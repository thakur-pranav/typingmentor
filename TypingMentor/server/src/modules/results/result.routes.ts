import { Router } from "express";
import { resultController } from "./result.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { submitResultSchema, historyQuerySchema } from "./result.validation";

const router = Router();

router.post("/", requireAuth, validate(submitResultSchema), resultController.submit);
router.get(
  "/history",
  requireAuth,
  validate(historyQuerySchema, "query"),
  resultController.history
);

export default router;
