import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { resultService } from "./result.service";
import { ApiError } from "../../utils/ApiError";

export const resultController = {
  submit: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const result = await resultService.submit(req.auth.userId, req.body);
    sendSuccess(res, 201, "Result saved", result);
  }),

  history: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const data = await resultService.getHistory(req.auth.userId, page, limit);
    sendSuccess(res, 200, "History retrieved", data);
  }),
};
