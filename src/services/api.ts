import axios from 'axios';
import { getAuthToken, getBaseUrl } from '@/utils/auth';
import { config, debugLog } from '@/config/environment';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration in development
debugLog('API Service initialized:', {
  baseURL: config.api.baseUrl,
  useMockData: config.api.useMockData,
  timeout: config.api.timeout,
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (request) => {
    const token = getAuthToken();
    const baseUrl = getBaseUrl();

    // Use stored base URL if available
    if (baseUrl) {
      request.baseURL = baseUrl;
    }

    // Add authorization header if token exists
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details in debug mode
    debugLog('API Request:', {
      method: request.method,
      url: request.url,
      baseURL: request.baseURL,
      hasAuth: !!token,
    });

    return request;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear authentication data and redirect to unauthorized page
      localStorage.removeItem('app_token');
      localStorage.removeItem('base_url');
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(error);
  }
);

export default api;