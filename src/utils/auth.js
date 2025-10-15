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
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiYzgzZTBmZGYwYmExNWRiZWU3MDIzMzFmYzA3MjFlZDk0OTdkMzdiOWQ1MDZiODlhMGU0NGUxODM5ZjM4MzA3NDIwMjllOGM3NDQ3MTFjZTkiLCJpYXQiOjE3NTI1NzcwNzUuNTk0NDc5LCJuYmYiOjE3NTI1NzcwNzUuNTk0NDgyLCJleHAiOjE3NTI2MTMwNzUuNTg1NzY5LCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.WCUnagPBsJwv5zVaN2YwjlNYxSLNGtXm4U1vCA2dcIwRHPWLT-jDE2Q4EqY_587l5uy7iQhZs8xtdAXZyUjcRs4W_9MzjLKs-eF3M2xT7KuA1OcuIjucAUu5TpzDjymxYUObfiEW48qkJe4Nr1GXUgCjm1V8ZYIR4CDVWT0b7GDEiysKOL0mL96bCkD9_GVZSCED8mf6rw8c9Cifw68zQ4OrqEgbOIRVxK0g-NEWp_SgKsZeh1kP68g4VeH-pEcY2NtLMcO5AskwDw9SBclSSHhLyIkfMTpS3zYmyuDKo3-JB1-I2fBIgF3dTZhHm2eq_Ld6P9srpDNKxkiV7sGqfnIHGc6Pid0i9B3B_hwzswc7MJvFX02T55w_fqzMPmslPvmKCfiOGjyIJeD8jT2nv0-Zb8WD37mDggrP_cKY5_eOWKf_RW9koawiqVuCLf9P-yHtGHBSDP4HQfeZlrS_GNWC3zu1oBa4xAbPNe-5Ix4Nnp6xNUGCwgVnN3DLdsS1jizaWieb5p7k48X0lPcrbtxg2VuQhCUqMfcJU00T2G34ZmYNlAb8CQYuE3B_R-FM0eHC1MyCqVRliR9j_Bjmb98R-wOFHes8Ootlh9OsFqf7MihH8Or312Tg5EpBvKE96x5C-L8rCxfugCyU3ineKJobF6s4QBnOTADttObBMs0"
  const baseUrl = "https://staging.api.ocw.sebipay.com/api/v4"
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