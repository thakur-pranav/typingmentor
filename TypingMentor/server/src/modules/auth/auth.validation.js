import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const googleAuthSchema = z
  .object({
    credential: z.string().min(1).optional(),
    accessToken: z.string().min(1).optional(),
  })
  .refine((data) => data.credential || data.accessToken, {
    message: "Either credential or accessToken must be provided",
  });
