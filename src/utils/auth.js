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
export const setAuthToken = (token) => {
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
export const setBaseUrl = (baseUrl) => {
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
export const handleAuthParams = (search) => {
  const searchParams = new URLSearchParams(search);
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiZGIyN2MyOWJmYzhjYWI3YzVhYjc5MTE3Y2MyY2U4NDhjNDIwMTY1NzI2MWVkMDI1MjU4ZWU2Y2I1YWRlZTVkMWVmZmY5MGM1YTMxZjAzZTAiLCJpYXQiOjE3NjAzNTUzMzMuMTQyMzUyLCJuYmYiOjE3NjAzNTUzMzMuMTQyMzU2LCJleHAiOjE3NjAzOTEzMzMuMTM0NDcsInN1YiI6IjEyMDExMSIsInNjb3BlcyI6W119.jygjUVL0oMamOt3650bURDFI28Y_kCG2C7V8H-iDyCU1VNB133qvMEhmmFGiCcvUA1lKr3hYhzIpI0ZBmsRjRed4rOFqW6eK5d1ec947OgLFlioMJ1WAxLby3j_mT3WyEx_8nZPpyR5cumwmsY8xnSwMXsZOeJ-rdqp6k0C9_zutMaL-zxRQqgNzxNggN63MjepFs67sDtCEC7s7QECyLmmrxI4EtReiQUvAUa5IOXidpEKwmD0NK82yhBNi3k9kz5yzxYmJ7TI59aOdLWiA9u_OfjE6MwJlTQJHPS2l0xTj4b_SRt2MtY5no4oZmc_dIZgTH-_Be21mFRg_GGpXJ-HutSK7HsCaLF7YUAiO5cmlj72BANa-lLlvbcTd7t_UJhYxivZ-6IGgB43wA7fc3QAT7nOZfx2usJrN5iCZh0e_itfaUHvksWK8GkK-ASK6KzYuwq1OD7ecXTDpaNhhm_JNOXvH0P2_FbFLZESnPKkPKs1ODHB_S_pxOt-6LA-WO10VDv9_d2ju1urb70kbdNlKORj4L-4getdzMkqbAt2e9stMD02pI-usDcmhyxV4PRVcySUIeDLHL0vZbxXNhgr5jI_iX0MoTa26L2bBKWxc8Cp8_8mUIlvhDfgRf-Nyij0brYDDKsuA4uWQ__LCKF00u-TWrI2Nz_qfZ3iy11g';
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
