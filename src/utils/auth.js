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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiOWIzMWRjZjdhYjU3NTE3MzJiNDEwMjQ5MDE5OGZjNGE4NmZlZmZhNWZlMGI1NzM2YjQ2OTRiMzRmNjJhMGEzN2RhOTdjNDg4YTE0ZmI3N2UiLCJpYXQiOjE3NTM2Nzg3MTkuMTAyNjU0LCJuYmYiOjE3NTM2Nzg3MTkuMTAyNjU3LCJleHAiOjE3NTM3MTQ3MTkuMDg4MDk4LCJzdWIiOiIxMjAwNzgiLCJzY29wZXMiOltdfQ.eccZXYA-diXPZ0ijFL0IuTuVRaGZLQpW_xgLiuneuu5B3BhhezIEov321WeFhhDA4WySUbsuMJa80SG0CiOfS-1JIYaJwK84y_SjoTrq-L9-mEl_04zMNxgsoc73E8dcOQvwf6qPv3HtWj5CmIZQYh3y7rwOBWcUOtQcUpoMRSTSGLS6LndUKTjD_GgI6HnIhn3_C9yJqtl6CQhMz4GRyx2NKVtBsguxUnrhhz7AeBZjpwkgicmicp_-Z51KsBIDJ6ZMZDBtCJlH0Tpw6AAeZNlTMwdQFN-NpuqatYNu78AsCkfdVWU_pCHguZAUxywG23Qud0C7nBJsDs1_FMYmeMzDNGww48_HcgpCaGJrgYSkrz-fpXWdf5iZgLDeJRrbuYhg_LCytCFb-_XXMsQS9JAtbU8ySgRq7wtWyqmbJ6LnRwCoQ4JXxwxPGvaxdPP0PbK3yMTPhxUJH-AV6DU3MGEJpYiZkfYFZuuX9csprFNYsiOUE-ZLcPoEONT8_2vVN6iiZrflgIu0I3bKj80JazUbcsty3RnWl2XfbZGZx4_KakxjdtPg6cB1vQF8vzhkIZpY0fTzeDbjq-ZJDD7VLRUulS9AIb0Aq7NsG9_FnmqYmdnwFzc980Yv9yuwdIg9FB58KoQgfDUeTFkyywoCDsx2WdwgM7DaV1--gw8sB08";
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