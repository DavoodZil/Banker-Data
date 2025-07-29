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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiNThkOWEzZjc2Yzc5OGU4ZDI4NjRmZWRkNzE0N2NiODM1ZmI2YzYxN2E3ODE4NDc4ODE5YWE2MzA0MWQ3YjMwNzdjYzRlYjg2ZTFkNjgyOGUiLCJpYXQiOjE3NTM3NzM0NzYuNTY3NzAzLCJuYmYiOjE3NTM3NzM0NzYuNTY3NzA2LCJleHAiOjE3NTM4MDk0NzYuNTQ3NzQ0LCJzdWIiOiIxMjAwNzgiLCJzY29wZXMiOltdfQ.IhKwty82f1VQvchtzCpakl-5UBU_Y-_3itat-YJeZMYJPqgKmJpHTD6CNuojdEx2yx7IYoRzaBgEtKBtaWz6uHENqW8q3CWiBNZjJqDJ9pgBA-fIYVXCcVUgSVfO17mMfLiyaWQamH9y-xnAiMAoDdvefibKYbyCBya7O3plkk-ab_XDv3nAYHfPANLxBjnfjQDQrLeMk14-47dwVlpj3_YYcrXkJAtKfMcqThyMGzZa0hEvjHi7UVRleYi2XjdV51qFCGfNJ6_cYHNvgHrkHIAfe3p6jiXQsmiQEe2Y2WQtkW6mmRUYqIY-2LoejRzk3x4u2tbMDlLQZknZCPRw_PDcInWo5J_q30_uNEyZjLsFT4jA-tf5943XPHptoN-WOb0GdUW5D2HjeIfpaskUKPwOzVABzQ022YQks3oNP1llkkjwFgQNZVQqRQQ8kcn75d3CWQ_X1cyPSPD_FQhzxNvnTzOYfU_EWDUc1WSbCN36WuOkB8wAj1nKVQ5ZFhBylxw_gHx1xtNkLUjFc0nqNaVsBFaaiPxcCZmeSrXeFq1CJvtZSU_lnhKlYs2jVJUQwjADRFsge00AxvLqMIRxTI_MtDZIljemdPuFekkV4f1zUd95rfj1CNeVyvOA8HhuslU7mYdVwoAeOtIWkBpwT5ApF_GyEa-n5JBqajJyEnQ";
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