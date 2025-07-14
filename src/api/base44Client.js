import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686e7485705b3725958c34cc", 
  requiresAuth: true // Ensure authentication is required for all operations
});
