import { apiClient } from "../../../lib/api/apiClient";

export const statisticsService = {
  async getStatistics() {
    const { data } = await apiClient.get("/statistics");
    return data.data;
  },
};
