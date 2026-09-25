import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { leaderboardService } from "./leaderboard.service.js";

export const leaderboardController = {
  get: asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1) || 1;
    const limit = Number(req.query.limit ?? 100) || 100;
    const leaderboard = await leaderboardService.getLeaderboard(page, limit);
    sendSuccess(res, 200, "Leaderboard retrieved", leaderboard);
  }),
};
