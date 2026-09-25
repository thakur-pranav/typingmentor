import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { authService } from "./auth.service.js";
import { userService } from "../users/user.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, "Registration successful", result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, "Login successful", result);
  }),

  logout: asyncHandler(async (_req, res) => {
    sendSuccess(res, 200, "Logout successful");
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.getById(req.auth.userId);
    sendSuccess(res, 200, "Current user", user);
  }),
};
