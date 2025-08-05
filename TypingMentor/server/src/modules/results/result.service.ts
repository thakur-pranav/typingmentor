import { ApiError } from "../../utils/ApiError";
import { resultRepository } from "./result.repository";
import { SubmitResultInput } from "./result.types";

// A very loose plausibility check: a legitimate typing test cannot exceed a
// few hundred WPM even for elite typists. This guards against obviously
// forged client-submitted values without re-deriving the full calculation
// server-side (the client-side engine already validated correctness).
const MAX_PLAUSIBLE_WPM = 400;

export const resultService = {
  async submit(userId: string, input: SubmitResultInput) {
    if (input.wpm > MAX_PLAUSIBLE_WPM || input.netWpm > MAX_PLAUSIBLE_WPM) {
      throw ApiError.badRequest("Submitted result is not plausible");
    }
    if (input.netWpm > input.wpm) {
      throw ApiError.badRequest("netWpm cannot exceed wpm");
    }
    return resultRepository.create(userId, input);
  },

  async getHistory(userId: string, page: number, limit: number) {
    const { results, total } = await resultRepository.findHistory(userId, page, limit);
    return {
      results,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },
};
