import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

type ValidationTarget = "body" | "query" | "params";

export function validate(schema: ZodTypeAny, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      (req as unknown as Record<ValidationTarget, unknown>)[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        next(ApiError.badRequest(message));
        return;
      }
      next(error);
    }
  };
}
