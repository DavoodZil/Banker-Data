/**
 * Environment Configuration
 * 
 * Centralized configuration for environment variables.
 * All environment variables must be prefixed with VITE_ to be accessible.
 */

const env = import.meta.env;

export const config = {
  // API Configuration
  api: {
    baseUrl: env.VITE_API_BASE_URL || 'https://app.onlinecheckwriter.com/api/v4',
    timeout: 30000, // 30 seconds
    useMockData: env.VITE_USE_MOCK_DATA === 'true',
  },

  // Feature Flags
  features: {
    enableIframeCommunication: env.VITE_ENABLE_IFRAME_COMMUNICATION === 'true',
    enableDebugMode: env.VITE_ENABLE_DEBUG_MODE === 'true',
  },

  // Plaid Configuration
  plaid: {
    environment: env.VITE_PLAID_ENV || 'sandbox',
  },

  // App Configuration
  app: {
    name: env.VITE_APP_NAME || 'Banker Data',
    version: env.VITE_APP_VERSION || '0.0.0',
    environment: env.MODE, // 'development' or 'production'
    isDevelopment: env.DEV,
    isProduction: env.PROD,
  },
};

// Helper function to check if using mock data
export const isUsingMockData = () => config.api.useMockData;

// Helper function to get API base URL
export const getApiBaseUrl = () => config.api.baseUrl;

// Helper function for debug logging
export const debugLog = (...args) => {
  if (config.features.enableDebugMode) {
    console.log('[DEBUG]', ...args);
  }
};

// Export environment type for TypeScript users (if needed later)
export const EnvironmentType = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0 && config.app.isProduction) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Run validation
validateEnvironment();

// Log configuration in development
if (config.app.isDevelopment) {
  console.log('Environment Configuration:', {
    environment: config.app.environment,
    apiBaseUrl: config.api.baseUrl,
    useMockData: config.api.useMockData,
    features: config.features,
  });
}

export default config;