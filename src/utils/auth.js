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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiY2M2NjFmMmQ4ZjYzOGUwOGY4MGViNDVmOTk5MjY0MDNlYTMwZmIzOTczZTU4M2JlMGIzMmI3ZWVlNDdhMGMwYTZhODE2OTE3YTJhMDY1YjQiLCJpYXQiOjE3NTI1NjI0MjAuNTMyNTgsIm5iZiI6MTc1MjU2MjQyMC41MzI1ODMsImV4cCI6MTc1MjU5ODQyMC41MjM4NCwic3ViIjoiMTIwMTExIiwic2NvcGVzIjpbXX0.Ko2N7fgY2gJT1Gbg-cbIom5yMhdZ39NUMxR-GOk8oYdsGaw6UIX9XjDuWV0RKB350mt5PVkvTFczMj3xZlv2ICZbuzn3e7GmkgJZJ41YrSM4nVWDJNBAyPQTcVFSoynDF4XiKbRfR-qwOfi66lxet8zJEfiwwAnV3umThK7ZgyULf7Ox_WWuahM3kd3Qldhsw4hSLrY-fjm1A_OHDEJSzavVSaslM9Pu06evJnu3Kp5M59RiLiEHb6etjrWWCHg87lKVIhKp8Fwd8qLTK79cOs8QdWm-X9dUqoo4iK9oidulV66i7LhxpeVUBAtDgDIA54S1BsxVM0xHuC2bfyPNogppy9W5twV3gqXtiL1xDGw15Ux7zctCwQb7OE7pXSNVRGx9J_Uuv-SE6g2TiLcPD9OtWcsR8mYajMc-TdGOCNyh9elDc-QEmdCznIrKvbVYhMq1s5XGsCjykVjBxnqaq-K6o5WiwYED9ZC44JOn9NQ2A45EyBbEV-0bwBbYz6BaQRH4_V4FaqGMIwqn49Wb98c7Sa3cP9-pFtjR3hKmehzlZ7BhlNH5zR1sbUI9qOLRvXKGvlI-1B7B9BXboGEogw65xrmzvc3eBkhdAk9Grk4zEqoMRjRsjGunmcyvjdwxOEYMpgpUNiHc1_WGRiAUQvZfzJaEib8U5ll_lg0M-S4"
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