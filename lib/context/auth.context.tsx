"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthState, LoginPayload } from "../types/user.types";
import { login, logout, refreshToken } from "../api/auth.api";
import { getCurrentUser } from "../api/users.api";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedAccessToken) {
          const user = await getCurrentUser(storedAccessToken);

          setState({
            user,
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please login again.",
        });

        toast.error("Session expired. Please login again");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (payload: LoginPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await login(payload);

      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const user = await getCurrentUser(newAccessToken);

      setState({
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const errorData =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorData,
      }));
      toast.error(errorData);
    }
  };

  const handleLogout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    } finally {
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    }
  };

  const handleRefreshToken = async (): Promise<string | null> => {
    if (!state.refreshToken || !state.user) {
      return null;
    }

    try {
      const { accessToken: newAccessToken } = await refreshToken({
        userId: state.user.id,
        refreshToken: state.refreshToken,
      });

      localStorage.setItem("accessToken", newAccessToken);

      setState((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);

      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please login again.",
      });

      toast.error("Session expired. Please login again.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
      return null;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login: handleLogin,
    logout: handleLogout,
    refreshAccessToken: handleRefreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
