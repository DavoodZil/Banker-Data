// Authentication utilities for token-based auth flow

/**
 * Get the stored authentication token
 * @returns {string|null} The stored token or null if not found
 */
export const getAuthToken = () => {
  return sessionStorage.getItem("app_token");
};

/**
 * Set the authentication token
 * @param {string} token - The token to store
 */
export const setAuthToken = (token: string) => {
  sessionStorage.setItem("app_token", token);
};

/**
 * Remove the authentication token
 */
export const removeAuthToken = () => {
  sessionStorage.removeItem("app_token");
};

/**
 * Get the stored base URL
 * @returns {string|null} The stored base URL or null if not found
 */
export const getBaseUrl = () => {
  return sessionStorage.getItem("base_url");
};

/**
 * Set the base URL
 * @param {string} baseUrl - The base URL to store
 */
export const setBaseUrl = (baseUrl: string) => {
  sessionStorage.setItem("base_url", baseUrl);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  sessionStorage.removeItem("app_token");
  sessionStorage.removeItem("base_url");
};

/**
 * Handle URL parameters for authentication
 * @param {string} search - URL search string
 */
export const handleAuthParams = (search: string) => {
  const searchParams = new URLSearchParams(search);
  // const token = searchParams.get("token");
  // const baseUrl = searchParams.get("baseUrl");
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiZDg1MzVjYjg0NWFmMDNiOGI2NGVjODFjMTYyMjE1NTNmNjQ4MjllZjFmMGUxMjAxZWFmZDRiYWYwNDRlYTkwZjQxZTkxOGU3YzRhYWVkY2IiLCJpYXQiOjE3NTI2NDU1MzYuMzIxOTMyLCJuYmYiOjE3NTI2NDU1MzYuMzIxOTM2LCJleHAiOjE3NTI2ODE1MzYuMzEwNjAzLCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.caRkb1SN4nq3pAXdZzCwwBDFlC2UypgS76cTW8xPPFcZvjIkUbMIgUJPa51Hb2dtZDiYh46DLt6Hx1F88FZBTPaa8GfK_h0iB5hNSUhlOiQO9qmcxTX4gQdSH4ur1EXMrtse7JJ7LyWOCL-QE9bQ8KZ9HLPxgdUgMGZ6zvZkMY9nvKCmzqM-kaQWhuafU9jpQp_gt55wzL87PErWOvEu9fu_QaR87-4h0CVhstK3Z2TFmY_k5Q0FWf-YT1YTMp6SZ2qRsoh4Iij7wpmqOWwFp_4skh1r2mPUvRL1ed2aJgKgchsIbIJGVWlWI2lalWJkqYkJG-GhKZgryHass1CQ5q1D64RYH6xzxeF-k3-8nX0-jhOlNA3J15fITou4YQvVy5IbYfTgMQR_-_YbmZORTdWAhAsqSjAYabS2R5J44lmHwIu5mSLB9hgTPPiY6xJ0T9oNr3y62uDdK-QhQGuXqy4q6NjvkNe3rY9lmR_qqPbCfcUmBKMm8agxLfppl8G0yJQ-w_ZGEjJL1hGVbxaAMeXTpX1Ntn2ABpEP1x8CB-xriuOW4rr6DTHWkZSjSRGQsr7KJwEt-6fAU18xANVYUJG06KoAOyTzs352w8brPZ0iOLddxES5UrUMWl73K5CNjq0X7a6U2bZoB12W9YpNQLdedzU_F5V0mhsuF3wFdSw";
  const baseUrl = "https://staging.api.ocw.sebipay.com/api/v4";
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }
  return false;
}; 