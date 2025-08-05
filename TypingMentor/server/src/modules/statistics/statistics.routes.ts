import { Router } from "express";
import { statisticsController } from "./statistics.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, statisticsController.get);

export default router;
