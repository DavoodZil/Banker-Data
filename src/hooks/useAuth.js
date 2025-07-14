import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(() => {
    const storedToken = sessionStorage.getItem("app_token");
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken, baseUrl = null) => {
    sessionStorage.setItem("app_token", newToken);
    if (baseUrl) {
      sessionStorage.setItem("base_url", baseUrl);
    }
    setToken(newToken);
    setIsAuthenticated(true);
    navigate("/dashboard");
  }, [navigate]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("app_token");
    sessionStorage.removeItem("base_url");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/unauthorized");
  }, [navigate]);

  const getAuthHeaders = useCallback(() => {
    const storedToken = sessionStorage.getItem("app_token");
    return storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
  }, []);

  const getBaseUrl = useCallback(() => {
    return sessionStorage.getItem("base_url") || import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    checkAuthStatus,
    getAuthHeaders,
    getBaseUrl,
  };
};