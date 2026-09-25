import { z } from "zod";

export const passageQuerySchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});
