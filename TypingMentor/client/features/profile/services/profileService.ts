import { apiClient } from "../../../lib/api/apiClient";
import { AuthUser } from "../../auth/types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const profileService = {
  async updateUsername(username: string): Promise<AuthUser> {
    const { data } = await apiClient.patch<ApiEnvelope<AuthUser>>("/users/me", { username });
    return data.data;
  },
};
