import { Router } from "express";
import { statisticsController } from "./statistics.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, statisticsController.get);

export default router;
