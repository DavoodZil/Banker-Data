/**
 * Get the stored authentication token
 * @returns {string|null} The stored token or null if not found
 */
export const getAuthToken = () => {
  return sessionStorage.getItem('app_token');
};

/**
 * Set the authentication token
 * @param {string} token - The token to store
 */
export const setAuthToken = token => {
  sessionStorage.setItem('app_token', token);
};

/**
 * Remove the authentication token
 */
export const removeAuthToken = () => {
  sessionStorage.removeItem('app_token');
};

/**
 * Get the stored base URL
 * @returns {string|null} The stored base URL or null if not found
 */
export const getBaseUrl = () => {
  return (
    sessionStorage.getItem('base_url') ||
    'https://staging.api.ocw.sebipay.com/api/v4'
  );
};

/**
 * Set the base URL
 * @param {string} baseUrl - The base URL to store
 */
export const setBaseUrl = baseUrl => {
  sessionStorage.setItem('base_url', baseUrl);
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
  sessionStorage.removeItem('app_token');
  sessionStorage.removeItem('base_url');
};

/**
 * Handle URL parameters for authentication
 * @param {string} search - URL search string
 */
export const handleAuthParams = search => {
  // const searchParams = new URLSearchParams(search);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiOTY5NjhiMmNhZTFhYTdjZjY1YTMxNTI4NDAyNDRiY2M2MTI3MDgzYjk2OTM4Y2Q4ZjczNTc4MzY5NjVlYmEzODI0NzE4YTU0NzUwZjFkNDgiLCJpYXQiOjE3NjA0MTYxODQuNzczMzI0LCJuYmYiOjE3NjA0MTYxODQuNzczMzI3LCJleHAiOjE3NjA0NTIxODQuNzY1MTU3LCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.hYp4iOntj1fVt26c1T8GllOX7kCW_GQLF0Vh0r3McJBkZm24TlvyzpqiA04xVF7HoG9YVjG-rALbrqBKCWBXRApGIUqJQVX0ItEroFgr4NLqjeyc09hz9RHDgNIo7hrb7QaaAJlsEMR-8rVo1sAWL7vta-fuAbjXsWMrNtI4_9B5aZEx6ZfLPZnPTEDDZeApE7CMDcEDDxJw2sp0pBbbsTrFoYdH-9JuRs4PmVlDzNyRdEl48jmw6rv9HppLTyVvT934yx-TXdeADddYa0acLJ-iAC6c0M_YR2KLSDtFYblszlsXPaiC2WjEKqVkXRWaWNrxAAA4T090GXynJq8Itzxr5zdgUTfAV9fjhoyHmWJfH4DYk4CAv-izErGNdW_0-RtoNnwuk8jG-wpOX1PFELErpYhDTVmjyzCOdsMRdxcSCjyiQHamM7ayqpPtuiaHjq0gsAIYzBOpWEeDOhxaJAxF7adKhxDc7KTcrzpo_qzTyCtVDL7IYT94y_4MN0JCPA_v-JbeCyPZTlJuNUBBeuHa8bANRD3_gOWJtVLKgo2bVaa-tWUwMry3heibqnce8rG6Fma-_PAbSNAa1Q73CQJQfkx2E_R15qMygJ3kJnwCUM98gvZw48zW2zM2YOa840n7hkN1_xI3O_oNbSgTfKuSAFULEJ1YMUtNSM2M0BA';
  const baseUrl = 'https://OCW-13023-DANISH-2.api.ocw.sebipay.com/api/v4';
  if (token) {
    setAuthToken(token);
    if (baseUrl) {
      setBaseUrl(baseUrl);
    }
    return true;
  }

  return false;
};
