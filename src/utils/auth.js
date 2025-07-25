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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiMTJlZjU5YWFjZWQwZTU2YTZlNzUwMzkxZjNjODkxYWZiMTQ0N2ZjYmY5MGMyODg2MzY4YzUwZjM1OWYxNDM2NDM3ODZmOGU1YjBjYmFmZGMiLCJpYXQiOjE3NTM0MTEyMTguNjE5NTc0LCJuYmYiOjE3NTM0MTEyMTguNjE5NTc3LCJleHAiOjE3NTM0NDcyMTguNTk1NDgsInN1YiI6IjEyMDExMSIsInNjb3BlcyI6W119.MVvTzq_aFCkYGobEggZ1FrZ5Ect3aMLNOHca0Po6eqBqwdYSC0vWB_tOnVCeVH8x7gMFamUovuKb8ElFgj2P_xsjSS5S2ZuL8U5_QaHN7LMQqQV5bLNfw9vt8RmN0Gdc3zT2fjsyVGlAWWInJUj99VhfsrKCc5kDetrz0DssDbAwbtTZbP3cFG8m1rly-bFugiAisJG-5c9Zdn670bYpL-edVUyaJpTDyFvV0g9fOboBmYvZ095PRelmSGJas6amhzI8XWpAcyXZW7HOgICW145MH1llaxJBS4z9rps9WfVeriwiWy021coup3yTuvl-86pI3FT9IDkNf9ZoTd3FQwAiMVZm9JLqh3K9e1MsNKX2iSbrBq48xh_NDx-q7QhwLf4TF-GoylPIFY5iTXYvNvveDH2cTW-29IX-lBpOsbnUPnNuotfZe18YNNohX09TIRlekQws4aWkfqbQsW3f4DxUFtTEYDkkS8Ocv0Vv4O73PDlZwsn4KCzLdvHIWTM5nBNdCRnLMcyNnA7uYscf-2_Hb-XRI_JDV4y1kih-iWf25lMWd1HYizgCsBFyex4GwXmwVIDMyGf27s4xv8IfqWdi0gRBBRnp9jX96JsSi73Lyfk_nbcO_1nfOtk0ICwHlQaVqEGskPjo4aocwOQrHX45jEn0AzJvaysuqgx0Qsc";
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