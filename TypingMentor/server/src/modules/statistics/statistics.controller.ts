import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { statisticsService } from "./statistics.service";
import { ApiError } from "../../utils/ApiError";

export const statisticsController = {
  get: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const stats = await statisticsService.getForUser(req.auth.userId);
    sendSuccess(res, 200, "Statistics retrieved", stats);
  }),
};
