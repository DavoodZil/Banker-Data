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
  const token = searchParams.get("token");
  const baseUrl = searchParams.get("baseUrl");
  // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiMmI3ZGEwNDNjNDExODg4MWM2OTlkODYzYjcyMDQxZmY3MTg4MDU5N2MwNjY0YTY5NGJjNzU1OTE2ODNiYzc2OTJiYTM0MmUzNTAyNDg3ZDEiLCJpYXQiOjE3NTQwNDk3OTkuNzA2MTQyLCJuYmYiOjE3NTQwNDk3OTkuNzA2MTQ1LCJleHAiOjE3NTQwODU3OTkuNjk3ODE4LCJzdWIiOiIxMjAwNzgiLCJzY29wZXMiOltdfQ.UGWNRKF36oyt8aefJyM1Uu3F10PaWyM_LBwSxC7KyPtLNrk7QDakaRM1vXeJqOokBn7MvsGLVrEZB8Qh1i_NHVqNpXqIjx5NdECCJVcF0YmxOPG4Gl4ZxOxTe5r9FU9G3SPeUF_T55msZH0HNZl7um9CddYh99bmkLFXMSFPCqsCHpgCfOib_et9u2aIjnbz7YLbIAmW5pBp1gsL_NrUoJm-icX11P8utAQPFngE901HqJ-v39_u58RSDc7qnDyBvxVT7htBYJWhs-hEkykwozyu6hf2rgs8GuSS1sguvEip6VKgmSwzOOy_jlZYTnerAm2OEAJTXsr9kqcoGz4pHrSHs14F57kPG0R6rFc6qlWb4ytbC9cu9mzqGVieoux4zoRrxIdi-36MhsAhPBIa3GHCv1KANqfYnf3SMvksCEkruvpDqib9qY-EAi4YLrQ7i3oz2SU6y7IhfDY3-a9nWKJgcWTaDx2cUtkJzRurc_td02qQ7gS-evdZJr4xRI4pGm5CDbednH1i54ZEBk0ND6gaf78ZwR0RwU2nwlW_uONLnwIb5PyE_19vypwlDDb3Lgb9bzUuEOPcPij1P-5gefQFRgQhlzFWbOYZ8zk7KkqBN_f-RrjSSxoNmNEXp20xjASW5XZAQIDiTGfYEPDstveZtLqJWULX8z_r8885tL4";
  // const baseUrl = "https://OCW-13023-DANISH-2.api.ocw.sebipay.com/api/v4";
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }

  

  return false;
}; 