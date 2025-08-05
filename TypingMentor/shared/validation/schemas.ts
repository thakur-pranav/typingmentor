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

export const submitResultSchema = z.object({
  mode: z.enum(["timed", "passage"]),
  duration: z.number().min(0),
  wpm: z.number().min(0),
  netWpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  totalCharacters: z.number().int().min(0),
  correctCharacters: z.number().int().min(0),
  incorrectCharacters: z.number().int().min(0),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
});
