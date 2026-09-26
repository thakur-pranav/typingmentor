import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { authService } from "./auth.service.js";
import { userService } from "../users/user.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, result.message || "Registration successful", result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, "Login successful", result);
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    sendSuccess(res, 200, "Email verified successfully", result);
  }),

  resendVerification: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    sendSuccess(res, 200, result.message, result);
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const { credential } = req.body;
    const result = await authService.googleLogin(credential);
    sendSuccess(res, 200, "Google login successful", result);
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
