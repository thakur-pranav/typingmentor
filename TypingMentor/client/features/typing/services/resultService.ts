import { apiClient } from "../../../lib/api/apiClient";
import { TestMode, TypingResult } from "../types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const resultService = {
  async submit(mode: TestMode, result: TypingResult): Promise<void> {
    await apiClient.post<ApiEnvelope<unknown>>("/results", { mode, ...result });
  },
};
