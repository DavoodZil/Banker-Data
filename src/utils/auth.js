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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiZDNhY2IyNGJkOGJlYzU3Mzg4MTA0YzM0ZmUyNDNmZmI5N2QxYjA5MDQ2NDNkZjJlN2ZiMjQwYTMyMmUxMTI4YTNlZDZmMDZmOWQxZDcwMTQiLCJpYXQiOjE3NTI0OTkxMTIuMTc2NjQzLCJuYmYiOjE3NTI0OTkxMTIuMTc2NjQ2LCJleHAiOjE3NTI1MzUxMTIuMTYzMjEzLCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.fa1jhiDMbjLgdNh2i0zVZrfWKu_byzLWm7GTew97muy3QQqQKd_tsCPE-5sA-xHneQIk1ZWjxJSbc-0CDhTSVrakxCKEmSFQPPks3etODVZclg52lYvhYJQmuJFvQMryU-qqtDliw0BOwLH2v5Te7v296XBwCA64GszcINGwbseJHB8vHaHyL7redEj2orHpKpx9lI1iMvHf5lCg_MJPPXqem_Gz0TnAIRBCVeNu3DJuQ3SEfMXUFeGBurmCP-TTg4N6kMUHI9jmMII-Ip6uFF5ZdeRbahZKolw_g1MQ001UfVkgy3gZmDd3IIgrwRVYWG8rORtuYqqtnZDmHZCUy8Zv6cG0Qk3gepMXK12Da8Yw0hMgyz4UqiLl4VGowKqZcZJPFcPdTGk9OA0pCYwewJlSeDKeWlDflOGGngXtNrcvHYj9YAzUyZBmc4HcUhTJhKD9tfL1Un_UUUXfXoXc7JJFXUmwuVRGdK-E1mUOG-XdIkeQAWQrT4iAeUasMpZ9RYvSWMSHOOM3sTIhr5_KY_6Fsw5069IeqcLuZJVjJ5u4D_yXA8eRfFe4IDsjM7a8ARql42ZyCukebFaJLH_1hBMObeSQPIzmtLJWhZXlqONvo3SXedg0kDp5MGifsQdhPrAWOX74QtXGKTcGzqlfndDojc0g_qrDZTD6uqYOOC4"
  const baseUrl = "https://staging.api.ocw.sebipay.com/api/v4"
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }
  return false;
}; 