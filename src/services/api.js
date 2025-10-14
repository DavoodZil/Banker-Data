import axios from 'axios';
import { getAuthToken, getBaseUrl } from '@/utils/auth';
import { config } from '@/config/environment';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  request => {
    const token = getAuthToken();
    const baseUrl = getBaseUrl();

    if (baseUrl) {
      request.baseURL = baseUrl;
    }

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

/*
const getErrorMessage = error => {
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
*/

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('app_token');
      sessionStorage.removeItem('base_url');
      window.location.href = '/unauthorized';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
