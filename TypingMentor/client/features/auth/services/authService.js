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

  async verifyEmail(payload) {
    const { data } = await apiClient.post("/auth/verify-email", payload);
    return data.data;
  },

  async resendVerification(payload) {
    const { data } = await apiClient.post("/auth/resend-verification", payload);
    return data.data;
  },

  async googleLogin(payload) {
    const { data } = await apiClient.post("/auth/google", payload);
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
