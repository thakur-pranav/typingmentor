import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export function validate(schema, target = "body") {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[target]);
      req[target] = parsed;
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
