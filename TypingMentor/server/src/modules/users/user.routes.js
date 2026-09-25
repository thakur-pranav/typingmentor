import { Router } from "express";
import { userController } from "./user.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { updateProfileSchema } from "./user.validation.js";

const router = Router();

router.get("/me", requireAuth, userController.getMe);
router.patch("/me", requireAuth, validate(updateProfileSchema), userController.updateMe);

export default router;
