const env = import.meta.env;

export const config = {
  api: {
    baseUrl:
      env.VITE_API_BASE_URL || 'https://app.onlinecheckwriter.com/api/v4',
    timeout: 30000,
  },

  features: {
    enableIframeCommunication: env.VITE_ENABLE_IFRAME_COMMUNICATION === 'true',
    enableDebugMode: env.VITE_ENABLE_DEBUG_MODE === 'true',
  },

  plaid: {
    environment: env.VITE_PLAID_ENV || 'sandbox',
  },

  app: {
    name: env.VITE_APP_NAME || 'Banker Data',
    version: env.VITE_APP_VERSION || '0.0.0',
    environment: env.MODE,
    isDevelopment: env.DEV,
    isProduction: env.PROD,
  },
};

export const getApiBaseUrl = () => config.api.baseUrl;

const validateEnvironment = () => {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !env[key]);

  if (missing.length > 0 && config.app.isProduction) {
    // Handle missing environment variables in production
  }
};

validateEnvironment();

export default config;
