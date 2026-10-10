import { apiClient } from "../../../lib/api/apiClient";

export const historyService = {
  async getHistory(page = 1, limit = 10, filter = {}) {
    const params = { page, limit };
    if (filter.mode && filter.mode !== "all") params.mode = filter.mode;
    if (filter.duration) params.duration = filter.duration;
    const { data } = await apiClient.get("/results/history", { params });
    return data.data;
  },
};
