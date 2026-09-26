import { ApiError } from "../utils/ApiError.js";
import { isProduction } from "../config/env.js";

export function errorMiddleware(err, _req, res, _next) {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = isProduction ? "Internal server error" : err.message;
  }

  if (!isProduction && !(err instanceof ApiError)) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.code ? { code: err.code } : {}),
  });
}
