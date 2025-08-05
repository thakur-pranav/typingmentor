import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
});
