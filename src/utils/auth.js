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
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiMzllM2M1ZDRlOTg4NWIyMDRjYWM1N2Q2M2M1M2FhMjc1MGY5ODIyZDYzY2ExNjA2ODFiYTQxOGQ1YTgyZTcyZTcwOGRjNGRhN2FlZThiODUiLCJpYXQiOjE3NjAzNjE2MDIuNDQ0Njg4LCJuYmYiOjE3NjAzNjE2MDIuNDQ0NjkxLCJleHAiOjE3NjAzOTc2MDIuNDM3NTU0LCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.Q3pby9OqW87E_-yHBMEaqQcPppS-AVV6gsTlCXmBx7vd0aTFO2z6kHCiLa89XjWPFJLKIXSJ75dOkhLPd9OJ5ECpdbw3FNUfC1Gos7EphwyAPKNZ1VVCofqRUF-6ZAYfSD3apk1lZSdYy1tpedwljym0GzFsHMEbX73tg9FAck6iHJApqygaZSdtvEs3inWKchLzFUnKNTGU47_XP2P63QUMfUSW3rnpcCvQv6-birxofCbTHu7_6G4oTzb1h4mXe6HJS5mKs2kBj_2s0TXJJFFjFfE3G1hwM_2cuxL-84YJDGvBBMOgNV-7lydQAEs4gX0aVKLGpjl95ZXndxwur6el9AwkplLmJ-j2GmXM7W5XG3-f2nOL5i804sOzJFttBxltq5gDMREj9YE0_0C3KxA1YBZ_RInwgIcyi-Jkhwv1I6tqFGY6Gf7WF-ilc7ZxK8KW5XJpRzUde0GydGdaaAz9WrufZqS5JEHRY95d8YFVP4COFO4NgSZed9Mr5cRXEVplwnSJuLiCrOIdJugeH8MLKuMeHwZPi9RiCOkKFbWTGNSafz0Fd-CEAOLBqRizIrHTdr1p1M5FFpwwViBsxuC00pA3vgvFVit0yciScTkszsAujHLetKvY2LlxWs0qlb1hjFf0uSnwNF_vwmAJ-PXhIUMjbZdbKbLrZDj_ZRI';
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
