import { apiClient } from "../../../lib/api/apiClient";

export const authService = {
  async register(payload) {
    const { data } = await apiClient.post("/auth/register", payload);
    return data.data;
  },

  async login(payload) {
    const { data } = await apiClient.post("/auth/login", payload);
    return data.data;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async getCurrentUser() {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  },
};
