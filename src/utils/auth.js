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
  // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiZWM3ODQ1YjlkYTRhNmMyOWI4M2M3Y2E0ZTgxODA3MjllMmFhZmY2MTk1NWRmYjE3NDMwZDEwMDFlNDgwYmM2NDA0MGMxMWEyODdiOWQ4YmUiLCJpYXQiOjE3NTM4NDk2MDQuNDY0MzU3LCJuYmYiOjE3NTM4NDk2MDQuNDY0MzYsImV4cCI6MTc1Mzg4NTYwNC40NDMxNTcsInN1YiI6IjEyMDA3OCIsInNjb3BlcyI6W119.gJq2tVMDuUCKOXxptuhpkiqVzYcVfe3NlPs_jG1M75_Fibu5DJxXbmd9-rkVu3qkZyCSq6YYpo8_0wyLDcNsLFO_sTS-uNnb1abdzVFNB2dEBfiIBXhMqyMK1V6aJC4Al4xawQINpUqbXFgiUQTV3uMcAOYutBWk5TlWA_P4akYXO30_7w2S_nprQbWan3TQKUaZ13WIOCgi7ero8laB7NOV_y_8HxRzQDIdxSKwrP5qvkiEE53p9MqNUXzgG0rujAGBXhD9uzd9DVAcK4dwOlN-KhGorLCgJtzf7ryeMeoQSC2f7p6x3JP7nxwjEeEhxNqjRCp02cooHY9z8wbPTxT8v1u0f05elvKk2YPo05ND5IkJePlrGJ9iQsqBgHa0ZQ2f8JFzfJhjlgY21v5e_HQZLnJLTNT7hBHCQrHkdIzjx_Ifks4iDRpqGpa8wX2BKTjt3-AHKh_XzR5RC4H3rb7IuxSrcYhORgy00Parl5szJ0njiTl656cL7n2cDNEo4L-V2IJkz87-0rHnoZKI6rtb1Yanpgcxon9-WQp_3JsvM0xg6zbkfgILtQ-ctSC4axBTUrlCmdRfAh61GQszXO3ZxmTWtrqn6JID8uhHgf1jduF-VXJ0-JHTdAts1-2jMmettcKg_Ohd-Nf_FmkQ0pnrrUgefHV7AV_IOhDoVxQ";
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