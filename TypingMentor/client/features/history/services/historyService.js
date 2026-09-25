import { apiClient } from "../../../lib/api/apiClient";

export const historyService = {
  async getHistory(page, limit = 10) {
    const { data } = await apiClient.get("/results/history", {
      params: { page, limit },
    });
    return data.data;
  },
};
