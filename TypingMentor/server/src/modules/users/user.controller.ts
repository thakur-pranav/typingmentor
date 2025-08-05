import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { userService } from "./user.service";
import { ApiError } from "../../utils/ApiError";

export const userController = {
  getMe: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.getById(req.auth.userId);
    sendSuccess(res, 200, "Current user retrieved", user);
  }),

  updateMe: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.updateProfile(req.auth.userId, req.body);
    sendSuccess(res, 200, "Profile updated", user);
  }),
};
