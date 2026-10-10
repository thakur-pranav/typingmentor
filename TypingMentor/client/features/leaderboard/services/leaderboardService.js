import { apiClient } from "../../../lib/api/apiClient";

export const leaderboardService = {
  async getLeaderboard(params = {}) {
    const { data } = await apiClient.get("/leaderboard", { params });
    return data.data;
  },
};
