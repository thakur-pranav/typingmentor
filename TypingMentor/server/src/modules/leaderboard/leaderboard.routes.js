import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller.js";

const router = Router();

router.get("/", leaderboardController.get);

export default router;
