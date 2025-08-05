import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller";

const router = Router();

router.get("/", leaderboardController.get);

export default router;
