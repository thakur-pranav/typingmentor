import { apiClient } from "../../../lib/api/apiClient";

export const leaderboardService = {
  async getLeaderboard() {
    const { data } = await apiClient.get("/leaderboard");
    return data.data;
  },
};
