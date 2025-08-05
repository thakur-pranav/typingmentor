import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { updateProfileSchema } from "./user.validation";

const router = Router();

router.get("/me", requireAuth, userController.getMe);
router.patch("/me", requireAuth, validate(updateProfileSchema), userController.updateMe);

export default router;
