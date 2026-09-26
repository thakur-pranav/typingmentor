"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import { clearToken, getToken, setToken } from "../../../lib/auth/tokenStorage";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (payload) => {
    const { token, user: loggedInUser } = await authService.login(payload);
    setToken(token);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const verifyEmail = useCallback(async (token) => {
    const { token: authToken, user: verifiedUser } = await authService.verifyEmail({ token });
    setToken(authToken);
    setUser(verifiedUser);
    return verifiedUser;
  }, []);

  const resendVerification = useCallback(async (email) => {
    return await authService.resendVerification({ email });
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const { token, user: loggedInUser } = await authService.googleLogin({ credential });
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      verifyEmail,
      resendVerification,
      googleLogin,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, verifyEmail, resendVerification, googleLogin, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
