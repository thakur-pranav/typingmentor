import { Response } from "express";

export interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response {
  const body: ApiResponseBody<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
}
