import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";

/**
 * Requires a valid Bearer JWT. Rejects the request if missing/invalid/expired.
 */
export function requireAuth(req, _res, next) {
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
 */
export function optionalAuth(req, _res, next) {
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
