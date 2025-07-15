// API Configuration
export const API_CONFIG = {
  // Base API endpoints
  ENDPOINTS: {
    CATEGORIES: '/api/categories',
    TRANSACTIONS: '/api/transactions',
    ACCOUNTS: '/api/accounts',
    TAGS: '/api/tags',
    RULES: '/api/rules',
    ENTITIES: '/api/entities',
    AUTH: '/api/auth',
    USERS: '/api/users'
  },

  // Default pagination settings
  PAGINATION: {
    DEFAULT_LIMIT: 500,
    MAX_LIMIT: 1000,
    DEFAULT_PAGE: 1
  },

  // Default sorting options
  SORTING: {
    CATEGORIES: {
      DEFAULT: '-updated_date',
      OPTIONS: ['name', '-name', 'created_date', '-created_date', 'updated_date', '-updated_date']
    },
    TRANSACTIONS: {
      DEFAULT: '-date',
      OPTIONS: ['date', '-date', 'amount', '-amount', 'description', '-description', 'created_date', '-created_date']
    }
  },

  // Error messages
  ERRORS: {
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.'
  }
};

// Helper function to build API URLs with query parameters
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.pathname + url.search;
};

// Helper function to handle API responses
export const handleApiResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  
  throw new Error(`API Error: ${response.status} - ${response.statusText}`);
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        throw new Error(API_CONFIG.ERRORS.UNAUTHORIZED);
      case 404:
        throw new Error(API_CONFIG.ERRORS.NOT_FOUND);
      case 422:
        throw new Error(data?.message || API_CONFIG.ERRORS.VALIDATION_ERROR);
      case 500:
        throw new Error(API_CONFIG.ERRORS.SERVER_ERROR);
      default:
        throw new Error(data?.message || `API Error: ${status}`);
    }
  } else if (error.request) {
    // Network error
    throw new Error(API_CONFIG.ERRORS.NETWORK_ERROR);
  } else {
    // Other error
    throw error;
  }
}; 