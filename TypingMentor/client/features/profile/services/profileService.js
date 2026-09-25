import { apiClient } from "../../../lib/api/apiClient.js";

export const profileService = {
  async updateUsername(username) {
    const { data } = await apiClient.patch("/users/me", { username });
    return data.data;
  },
};
