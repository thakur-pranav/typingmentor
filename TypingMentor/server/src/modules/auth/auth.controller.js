import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { authService } from "./auth.service.js";
import { userService } from "../users/user.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const REFRESH_COOKIE_NAME = "tm_refresh_token";

export function getRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

function setRefreshCookie(res, refreshToken) {
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  }
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });
}

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...data } = result;
    sendSuccess(res, 201, result.message || "Registration successful", data);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...data } = result;
    sendSuccess(res, 200, "Login successful", data);
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...data } = result;
    sendSuccess(res, 200, "Email verified successfully", data);
  }),

  resendVerification: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    sendSuccess(res, 200, result.message, result);
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const result = await authService.googleLogin(req.body);
    setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...data } = result;
    sendSuccess(res, 200, "Google login successful", data);
  }),

  refresh: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;
    const result = await authService.refresh(refreshToken);
    setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...data } = result;
    sendSuccess(res, 200, "Token refreshed successfully", data);
  }),

  logout: asyncHandler(async (req, res) => {
    const userId = req.auth?.userId;
    await authService.logout(userId);
    clearRefreshCookie(res);
    sendSuccess(res, 200, "Logout successful");
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.auth) throw ApiError.unauthorized();
    const user = await userService.getById(req.auth.userId);
    sendSuccess(res, 200, "Current user", user);
  }),
};
