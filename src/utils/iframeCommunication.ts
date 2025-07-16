// Iframe communication utilities for Angular integration

/**
 * Send a message to the parent Angular application
 * @param {string} action - The action type
 * @param {object} data - The data to send
 */
export const sendIframeMessage = (action: string, data: any = {}) => {
  if (window.parent && window.parent !== window) {
    const message = {
      source: 'banker-data-iframe',
      action,
      data,
      timestamp: new Date().toISOString()
    };
    
    window.parent.postMessage(message, '*');
    console.log('Sent to parent:', message);
  }
};

/**
 * Send a message to the parent Angular application (alias for backward compatibility)
 * @param {string} action - The action type
 * @param {object} data - The data to send
 */
export const sendToParent = (action: string, data: any = {}) => {
  if (window.parent && window.parent !== window) {
    const message = {
      source: 'banker-data-iframe',
      action,
      data,
      timestamp: new Date().toISOString()
    };
    
    window.parent.postMessage(message, '*');
    console.log('Sent to parent:', message);
  }
};

/**
 * Listen for messages from the parent Angular application
 * @param {function} callback - Callback function to handle messages
 * @returns {function} - Cleanup function to remove the listener
 */
export const listenToParent = (callback: (data: any) => void) => {
  const messageHandler = (event: MessageEvent) => {
    if (event.data.source === 'angular-parent') {
      console.log('Received from parent:', event.data);
      callback(event.data);
    }
  };
  
  window.addEventListener('message', messageHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageHandler);
  };
};

/**
 * Request data from the parent Angular application
 * @param {string} action - The action type
 * @param {object} data - The data to send
 * @returns {Promise} - Promise that resolves with the response
 */
export const requestFromParent = (action: string, data: any = {}) => {
  return new Promise((resolve, reject) => {
    const requestId = Date.now().toString();
    
    const messageHandler = (event: MessageEvent) => {
      if (event.data.source === 'angular-parent' && 
          event.data.requestId === requestId) {
        window.removeEventListener('message', messageHandler);
        
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.data);
        }
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    sendToParent(action, {
      ...data,
      requestId
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      reject(new Error('Request timeout'));
    }, 10000);
  });
};

/**
 * Notify the parent that the iframe is ready
 */
export const notifyReady = () => {
  sendToParent('iframe:ready', {
    version: '1.0.0',
    features: [
      'accounts',
      'transactions', 
      'categories',
      'rules',
      'tags',
      'entities'
    ]
  });
};

/**
 * Notify the parent about route changes
 * @param {string} route - The current route
 */
export const notifyRouteChange = (route: string) => {
  sendToParent('route:change', { route });
};

/**
 * Notify the parent about user actions
 * @param {string} action - The user action
 * @param {object} data - Action data
 */
export const notifyUserAction = (action: string, data: any = {}) => {
  sendToParent('user:action', { action, data });
};

// Auto-notify when the script loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', notifyReady);
  } else {
    notifyReady();
  }
} 