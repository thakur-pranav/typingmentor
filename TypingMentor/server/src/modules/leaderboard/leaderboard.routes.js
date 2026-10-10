import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { leaderboardQuerySchema } from "./leaderboard.validation.js";

const router = Router();

router.get("/", validate(leaderboardQuerySchema, "query"), leaderboardController.get);

export default router;
