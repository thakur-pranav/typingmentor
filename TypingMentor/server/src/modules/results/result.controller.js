import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { resultService } from "./result.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const resultController = {
  submit: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const result = await resultService.submit(req.auth.userId, req.body);
    sendSuccess(res, 201, "Result saved", result);
  }),

  history: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const { page, limit, mode, duration } = req.query;
    const filter = {};
    if (mode) filter.mode = mode;
    if (duration) filter.duration = duration;
    const data = await resultService.getHistory(req.auth.userId, page, limit, filter);
    sendSuccess(res, 200, "History retrieved", data);
  }),
};
