import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { authService } from "./auth.service";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { userService } from "../users/user.service";
import { ApiError } from "../../utils/ApiError";

export const authController = {
  register: asyncHandler(async (req, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, "Account created successfully", result);
  }),

  login: asyncHandler(async (req, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, "Logged in successfully", result);
  }),

  logout: asyncHandler(async (_req, res: Response) => {
    // Stateless JWT: the client discards the token. Nothing to invalidate server-side.
    sendSuccess(res, 200, "Logged out successfully");
  }),

  me: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.getById(req.auth.userId);
    sendSuccess(res, 200, "Current user retrieved", user);
  }),
};
