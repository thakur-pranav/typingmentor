import { z } from "zod";

export const leaderboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  mode: z.enum(["timed", "passage", "code"]).optional(),
  duration: z.coerce.number().int().positive().optional(),
});
