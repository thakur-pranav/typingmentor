import { ApiError } from "../../utils/ApiError.js";
import { resultRepository } from "./result.repository.js";

const MAX_PLAUSIBLE_WPM = 400;

export const resultService = {
  async submit(userId, input) {
    if (input.wpm > MAX_PLAUSIBLE_WPM || input.netWpm > MAX_PLAUSIBLE_WPM) {
      throw ApiError.badRequest("Submitted result is not plausible");
    }
    if (input.netWpm > input.wpm) {
      throw ApiError.badRequest("netWpm cannot exceed wpm");
    }
    return resultRepository.create(userId, input);
  },

  async getHistory(userId, page, limit) {
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
