import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../modules/auth/token.service";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email: string;
  };
}

/**
 * Requires a valid Bearer JWT. Rejects the request if missing/invalid/expired.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(ApiError.unauthorized("Missing or malformed Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.userId, email: payload.email };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

/**
 * Attaches auth info if a valid token is present, but never rejects the request.
 * Used for routes usable both anonymously and authenticated (e.g. typing test).
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.userId, email: payload.email };
  } catch {
    // Ignore invalid tokens for optional auth.
  }
  next();
}
