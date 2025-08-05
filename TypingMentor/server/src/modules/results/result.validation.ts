import { z } from "zod";

export const submitResultSchema = z.object({
  mode: z.enum(["timed", "passage"]),
  duration: z.number().min(0),
  wpm: z.number().min(0),
  netWpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  totalCharacters: z.number().int().min(0),
  correctCharacters: z.number().int().min(0),
  incorrectCharacters: z.number().int().min(0),
}).refine((data) => data.correctCharacters + data.incorrectCharacters <= data.totalCharacters, {
  message: "correctCharacters + incorrectCharacters cannot exceed totalCharacters",
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
