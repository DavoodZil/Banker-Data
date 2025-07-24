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
export const setAuthToken = (token) => {
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
export const setBaseUrl = (baseUrl) => {
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
export const handleAuthParams = (search) => {
  const searchParams = new URLSearchParams(search);
  // const token = searchParams.get("token");
  // const baseUrl = searchParams.get("baseUrl");
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiMWZkYzIyN2NmMzlkMzU0NTY0MmNjOThjODEzYzNlNTQ3NjZjYjFjM2YzOGUwNzUxNGUyMzkwOGEyMGI4YTEwNGVlOWE4NGNhNGNkYWFkMWEiLCJpYXQiOjE3NTMzNDMzOTQuODMxODc1LCJuYmYiOjE3NTMzNDMzOTQuODMxODc5LCJleHAiOjE3NTMzNzkzOTQuODIwMDAyLCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.XOOEEXjsoK1mEg-5jL-2-QN50fLyD6pJHb3uD9prSRxIam5FZJ31TUhrvW1rOr2cNd8g_9yB4Z0jFXgpmgcIEjw4Wo7MFGHoYEm0i9mW9VvhI-1F6FHJ_GKC1R6BuFrCPL7IyjZoYVeEc-7W5cmtc9C1IDWsMc1nqUKtOE_Iv6-ag9jx5B-UwFfd3kNlpHcPPDHNezGxAfAEy75EnvlOVJMELDRI7P8nu_K1mxy-lPNbrOaXwUPlhbTDLCPYZOEYLuMc6wD7qRTDGIIaVcjMSzKFE_itf-dv-FcLaJsteIT_NpTFNfeuUdDLZhSS-UMSsH8uOrCFmZVFT1fSMwP6jahTAYF2MpskbsbADmT4RWKmpmnYtJat7MAizIKbllDzd159u9qEcK8DeCCihgs-WStyRmEPXu6Og-rxxOQiUKIP7DRdLOoO9QfT_Ksftt_clzntH-_3-E2mVKzmUzMwHANSWj1yCnc_VhO2ngLoLr8900WrRL-3aM63MktKpKodmGtksR5wnEhX6TCJmlizgfsXippgH9RDzFl1edkmd3NQ5Gr3tXIxe5CqcMaKKDib3B1HZhN7diKiIBsTeQarnCI1CHkXccHMgi9K8ArM80QBg3vr-ZOHRYNW1KLaI4ykbnvfyg5WpwWu2UeX4NOJYr6GOgICVSiT5M7dhIujqE0";
  const baseUrl = "https://OCW-13023-DANISH-2.api.ocw.sebipay.com/api/v4";
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }

  

  return false;
}; 