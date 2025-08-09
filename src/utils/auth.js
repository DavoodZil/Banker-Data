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
  // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiOTQ2NmY0MTZhZGIyM2VmOTUwMWJiNjNjNWVjYTU3YjM1NGYyNjAzMDg2MDZmNmY1YWE5N2JiYThmMzgzNTZkMDA4YjNlOWMwZmE1ZTAwNGMiLCJpYXQiOjE3NTQ2Mjk0NTYuMjMwMjMzLCJuYmYiOjE3NTQ2Mjk0NTYuMjMwMjM2LCJleHAiOjE3NTQ2NjU0NTYuMjE3MTcyLCJzdWIiOiIxMjAwNzgiLCJzY29wZXMiOltdfQ.NrsnCwKv40FzOy7P-QyZCC-U48Su5_f15cxJf8R6nHEUhgxu2i0RraP5deLGLyhTKs0box2UBWhWzcyHwp2mSBiHFzF9FU9Ces2ANk7GWSV9THwyc-tVaH0rdj9pQIK2NrCzlNz-TJ9zA-wOE2LoAHy4IprEFS16uEX3-uxTkdmTU_ir5BCKkSGitwmHEXWiJG55KgaxNqKDlbt8NWFcFG7UcrjSXxUzH1q75wj4mNmLbPgZfvE2_J9cHgC0nBV89rA3AZQXKx5olT0bvirn9-SGvsOVyui92yos9x1OybA8IaGC3HaouV9WoJ-6M6KCMshXVE_QCSOUS-ZcYKGj-L4xSmZvqbGd8adAoFkhTBWOTkzfovANddg5IPqcGaP_BAv-BvfR54by2i_EJmJLbSe1JH2h5tF9Zdwiyswbv1-kXTGcoIbtKDvRmooZm4XyFXna2dpdvE8rmHI6SFNRBzM1uj55T8m2iUpYMHTON__kiPKaN9mZjl6MgMAPxvGJPFQ0AAJqK3QwCF--x_8K4SsGKM4Gp3GzxGmIpQV5TlXHjXx_dZm9Oq_tpKY_sJ6TfwXM-bPAZCQP7r80U42M8ZbYDkkqDTllLR8wSMfzNJIKjOcK0-_B6KBX8a-x3t6VNCYoT692Mp9MA8yPDlR7XzwBkg7kL-1sq6IOYrgoCCA";
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