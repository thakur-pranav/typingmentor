import { Router } from "express";
import { typingController } from "./typing.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { passageQuerySchema } from "./typing.validation.js";

const router = Router();

router.get("/passages", validate(passageQuerySchema, "query"), typingController.listPassages);

export default router;
