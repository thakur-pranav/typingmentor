import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { isProduction } from "../config/env";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = isProduction ? "Internal server error" : err.message;
  }

  if (!isProduction && !(err instanceof ApiError)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
