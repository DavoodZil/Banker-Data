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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiMmUzODdjYzAyZmQ5MDA3NGM3YmY4ODA4ZDYzNjc0NTYyZWI0NTk2ZmNjMWMzNjMwNjg1YTFmODgzZjMzMjhlMmZiMmIyZjVhMWEwNWU2NWEiLCJpYXQiOjE3NTM5NTIyNTIuNDI0NTksIm5iZiI6MTc1Mzk1MjI1Mi40MjQ1OTQsImV4cCI6MTc1Mzk4ODI1Mi40MTMzODgsInN1YiI6IjEyMDA3OCIsInNjb3BlcyI6W119.OrFUQsPvf4kcnI4u1xUHZ0vIcqvDD4orFBAx8dGuAXHqOTlNXH57oGrjYai7kjueNfUhc2XKIEYiEjvy3dVqMKvwqTOGsxkUwSuX3bnS8YOWEZT0Td53Y4S_xpxfUtZYpxvvq-dRQo_RnV9s8kYqgcGzdBwmqEDT95lEiEk9RDuL9LruRFRv7WzkbaZTQOb1nQIvhXUSPV3Uy05QuQf1LX0BRvIBFBwGjBhYf-0qMCO5dYU5dBPZg6sedLhmquSJTqvU4vqDb5wi7Evzz68owD96qajY7pcmnbIWBDm98aHeAPXNE4t77pb8O2e9cROeaK8ML3HyZ8bFp251qZnJ5KIQnWCFrdZA1Aw_Te8rwrASJHUyAHXqFGax7HwFFCfE333LAjR3AuQlzi-lhQYuarHFbm5uacAzMd99SOFhl6Xjp5B7CxcU2ofemtYf1cPxs5Xha6U_CkNCdVcekHcWucIIglbO9plouUp1FurzPMp38XeV8tE_PtQI6uVfFHKrt7WF169jrm3-2IYIpja8bw98-XBXCzsHmgJAQe1MkDfhDES3KcL9vo96ACxPESCtg9qK87DW4w4yT7Kza_Mpe8-inW0XwwMctkOuepTAuOX-QSLZJ0T7BMhBjEzBuQb-Xa7D_mNKKBSAbAjVQQJhxYssoCMAnnImg7ERp8pbBaw";
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