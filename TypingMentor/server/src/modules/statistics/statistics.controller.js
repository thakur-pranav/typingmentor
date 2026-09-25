import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { statisticsService } from "./statistics.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const statisticsController = {
  get: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const stats = await statisticsService.getForUser(req.auth.userId);
    sendSuccess(res, 200, "Statistics retrieved", stats);
  }),
};
