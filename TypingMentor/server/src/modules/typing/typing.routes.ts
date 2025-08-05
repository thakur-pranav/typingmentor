import { Router } from "express";
import { typingController } from "./typing.controller";
import { validate } from "../../middleware/validation.middleware";
import { passageQuerySchema } from "./typing.validation";

const router = Router();

router.get("/passages", validate(passageQuerySchema, "query"), typingController.listPassages);

export default router;
