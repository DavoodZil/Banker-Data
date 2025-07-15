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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiYjgxN2Q3OWM0Mjk4ZmQyNWU4MGMzZTJiODJhNTI5YjE4ZTdmNDQzYmU5MDk4YmI0MzljNjU3YjEzMjMyZjlhODFiZjRhNGY0YjViZjhkMjAiLCJpYXQiOjE3NTI1Nzk3MzYuMTUwMzQyLCJuYmYiOjE3NTI1Nzk3MzYuMTUwMzQ1LCJleHAiOjE3NTI2MTU3MzYuMTQwMTI3LCJzdWIiOiIyODU2NyIsInNjb3BlcyI6W119.HQGSft-MTPwyHgL11xOulGb7UA3lhiD-y4aVxl-yfU-y0DaBMLbWDhzXBr0du9TARv__guZzzwUC_SGZfdRv5wcQObWfe3HXX-XMboJRaqLPAQinlmtL6212At0eXjPooDFicT1d2FMPEjmu1g-f6pyHdxuOtVwn-CDXRfBXmy1BcvgAsVPfXLXso4Sw2dgn1jeFV_6OYV7vrYKBshEwtMthlFWHrsOQNpGicH_Pb1BiV-K2HbRI64NSrcsI0PF3BQH5P2jLQvtlnDelvIttZlabyoMHo8GAiHtHgjxSv9VzTV2Dhg5qvumSE5yF4WgZ0UuI0mQf6k_fcavxTmeD6rK5fwctn-MMeJusbsn9tkwLiFyF5vpr2tIQIxY3APGUOLO6izFaT3dKmqknkUZavSP_UucpaCRsmfr8Gq8Cd8_TRffyFi9SV-lXn8FhCGuB37xrqew9JBRzxpdvTPCt8HfKBkcUAuL__Hrmi26RZsvUGAudbRC8JORejtoiyUcMhjOozgCV274qYZBNPIXantV9ppwA7C3qRBCBROfa4ZMmMxwNdQWhv2AxIlKFhhcCBuuDyMO1y_L08G_Z4FF7mD1lXkfPAGKip5IpygNOa1bW37Kp5aj6LRwC7Rh-FngftXUmtoKqvLf2LnkOiM9_cOgUQrRuabHIrDXvZKb61ZI"
  const baseUrl = "https://app.onlinecheckwriter.com/api/v4/"
  console.log("Token:", token);
  console.log("Base URL:", baseUrl);
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }
  return false;
}; 