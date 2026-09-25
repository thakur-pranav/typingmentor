import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { userService } from "./user.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const userController = {
  getMe: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.getById(req.auth.userId);
    sendSuccess(res, 200, "Current user retrieved", user);
  }),

  updateMe: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.updateProfile(req.auth.userId, req.body);
    sendSuccess(res, 200, "Profile updated", user);
  }),
};
