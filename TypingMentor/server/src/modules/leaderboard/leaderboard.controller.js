import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { leaderboardService } from "./leaderboard.service.js";

export const leaderboardController = {
  get: asyncHandler(async (req, res) => {
    const { page, limit, mode, duration } = req.query;
    const filter = {};
    if (mode) filter.mode = mode;
    if (duration) filter.duration = duration;

    const leaderboard = await leaderboardService.getLeaderboard(page, limit, filter);
    sendSuccess(res, 200, "Leaderboard retrieved", leaderboard);
  }),
};
