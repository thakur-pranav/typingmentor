import axios from "axios";
import { getToken, clearToken } from "../auth/tokenStorage.js";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const cleanApiUrl = rawApiUrl.replace(/\/+$/, "");
const baseURL = cleanApiUrl.endsWith("/api") ? cleanApiUrl : `${cleanApiUrl}/api`;

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
