import { ApiError } from "../utils/ApiError.js";

export function notFoundMiddleware(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
