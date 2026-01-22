import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import type { LoginRequest, RegisterRequest } from "../types";
import { User } from "@chatapp/common-types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Session expired or invalid token");
        localStorage.removeItem("jwtToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);

      if (response.accessToken) {
        localStorage.setItem("jwtToken", response.accessToken);
      }
      setUser(response.user);
      console.log("Login successful: ", response.user);

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      const message = err.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);

      if (response.accessToken) {
        localStorage.setItem("jwtToken", response.accessToken);
      }
      setUser(response.user);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // For google login, we don't have a form data, we only have a token
  const loginWithGoogle = async (token: string) => {
    localStorage.setItem("jwtToken", token);
    window.location.href = "/dashboard";
  };

  const logout = async () => {
    try {
      localStorage.removeItem("jwtToken");
      setUser(null);
      navigate("/login");
    } catch (err: any) {
      setError("Failed to logout");
    }
  };

  return {
    user,
    login,
    loginWithGoogle,
    logout,
    isLoading,
    error,
    register,
  };
};
