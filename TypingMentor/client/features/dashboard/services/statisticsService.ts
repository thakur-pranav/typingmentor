import { apiClient } from "../../../lib/api/apiClient";
import { UserStatistics } from "../types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const statisticsService = {
  async getStatistics(): Promise<UserStatistics> {
    const { data } = await apiClient.get<ApiEnvelope<UserStatistics>>("/statistics");
    return data.data;
  },
};
