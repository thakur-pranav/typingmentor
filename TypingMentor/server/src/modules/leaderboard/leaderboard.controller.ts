import { Response, Request } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { leaderboardService } from "./leaderboard.service";

export const leaderboardController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1) || 1;
    const limit = Number(req.query.limit ?? 100) || 100;
    const leaderboard = await leaderboardService.getLeaderboard(page, limit);
    sendSuccess(res, 200, "Leaderboard retrieved", leaderboard);
  }),
};
