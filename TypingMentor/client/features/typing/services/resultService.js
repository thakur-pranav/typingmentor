import { apiClient } from "../../../lib/api/apiClient";

export const resultService = {
  async submit(mode, result) {
    await apiClient.post("/results", { mode, ...result });
  },
};
