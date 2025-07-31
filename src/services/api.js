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

    return Promise.reject(error);
  }
);

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  console.log(error);
  if (error.response?.data?.errorMsg) {
    return error.response.data.errorMsg;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  switch (error.response?.status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Authentication failed. Please log in again.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'Conflict. The resource already exists or there is a conflict.';
    case 422:
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. The server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. The request took too long to process.';
    default:
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return 'Network error. Please check your internet connection.';
      }
      if (error.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
      }
      return error.message || 'An unexpected error occurred.';
  }
};

// Response interceptor to handle errors and show toast notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    debugLog('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear authentication data and redirect to unauthorized page
      sessionStorage.removeItem('app_token');
      sessionStorage.removeItem('base_url');
      window.location.href = '/unauthorized';
      return Promise.reject(error);
    }
    
    // Pass error through for handling in the calling code
    return Promise.reject(error);
  }
);

export default api;