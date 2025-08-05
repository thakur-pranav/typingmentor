import { apiClient } from "../../../lib/api/apiClient";
import { TestResultSummary } from "../../dashboard/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResults {
  results: TestResultSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const historyService = {
  async getHistory(page: number, limit = 10): Promise<PaginatedResults> {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedResults>>("/results/history", {
      params: { page, limit },
    });
    return data.data;
  },
};
