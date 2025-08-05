import { apiClient } from "../../../lib/api/apiClient";
import { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from "../types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/register", payload);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiEnvelope<AuthUser>>("/auth/me");
    return data.data;
  },
};
