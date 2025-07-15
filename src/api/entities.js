// Mock entities for iframe integration
// These will communicate with the parent Angular application via postMessage

import { mockAccounts, mockTransactions, mockCategories, mockTags, mockRules, mockFinancialEntities } from './mockData.js';

// Helper function to communicate with parent Angular app
const sendToParent = (action, data) => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      source: 'banker-data-iframe',
      action,
      data
    }, '*');
  }
};

// Helper function to listen for messages from parent
const listenToParent = (callback) => {
  window.addEventListener('message', (event) => {
    if (event.data.source === 'angular-parent') {
      callback(event.data);
    }
  });
};

// Mock Account entity
export const Account = {
  async list() {
    sendToParent('accounts:list', {});
    return mockAccounts;
  },
  
  async get(id) {
    const account = mockAccounts.find(a => a.id === id);
    sendToParent('accounts:get', { id, account });
    return account;
  },
  
  async create(data) {
    const newAccount = {
      id: Date.now().toString(),
      ...data,
      lastSync: new Date().toISOString(),
      isActive: true
    };
    sendToParent('accounts:create', { account: newAccount });
    return newAccount;
  },
  
  async update(id, data) {
    sendToParent('accounts:update', { id, data });
    return { id, ...data };
  },
  
  async delete(id) {
    sendToParent('accounts:delete', { id });
    return { success: true };
  }
};

// Mock Transaction entity
export const Transaction = {
  async list(filters = {}) {
    sendToParent('transactions:list', { filters });
    return mockTransactions;
  },
  
  async get(id) {
    const transaction = mockTransactions.find(t => t.id === id);
    sendToParent('transactions:get', { id, transaction });
    return transaction;
  },
  
  async create(data) {
    const newTransaction = {
      id: Date.now().toString(),
      ...data,
      date: data.date || new Date().toISOString()
    };
    sendToParent('transactions:create', { transaction: newTransaction });
    return newTransaction;
  },
  
  async update(id, data) {
    sendToParent('transactions:update', { id, data });
    return { id, ...data };
  },
  
  async delete(id) {
    sendToParent('transactions:delete', { id });
    return { success: true };
  }
};

// Category entity with proper API integration
export const Category = {
  async list() {
    // Use axios instance to call the real API endpoint
    try {
      const response = await (await import('@/services/api')).default.get('/bank-data/categories');
      // The API returns { success: true, data: { categories: [...] } }
      if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.categories)) {
        return response.data.data.categories;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },
  
  async create(body) {
    try {
      // Map the form data to match the Angular API structure
      const apiBody = {
        name: body.name,
        parent: body.parent_category || null
      };
      
      const response = await (await import('@/services/api')).default.post('/bank-data/categories', apiBody);

      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },
  
  async update(body) {
    try {
      // Map the form data to match the Angular API structure
      const apiBody = {
        id: body.id,
        name: body.name,
        yd_category_id: body.yd_category_id || undefined
      };
      
      const response = await (await import('@/services/api')).default.put('/bank-data/categories', apiBody);

      return response.data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const response = await (await import('@/services/api')).default.delete(`/bank-data/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  }
};

// Mock Rule entity
export const Rule = {
  async list() {
    sendToParent('rules:list', {});
    return mockRules;
  },
  
  async create(data) {
    const newRule = {
      id: Date.now().toString(),
      ...data,
      isActive: true
    };
    sendToParent('rules:create', { rule: newRule });
    return newRule;
  },
  
  async update(id, data) {
    sendToParent('rules:update', { id, data });
    return { id, ...data };
  },
  
  async delete(id) {
    sendToParent('rules:delete', { id });
    return { success: true };
  }
};

// Mock Tag entity
export const Tag = {
  async list() {
    sendToParent('tags:list', {});
    return mockTags;
  },
  
  async create(data) {
    const newTag = {
      id: Date.now().toString(),
      ...data
    };
    sendToParent('tags:create', { tag: newTag });
    return newTag;
  },
  
  async update(id, data) {
    sendToParent('tags:update', { id, data });
    return { id, ...data };
  },
  
  async delete(id) {
    sendToParent('tags:delete', { id });
    return { success: true };
  }
};

// Mock FinancialEntity entity
export const FinancialEntity = {
  async list() {
    sendToParent('entities:list', {});
    return mockFinancialEntities;
  },
  
  async create(data) {
    const newEntity = {
      id: Date.now().toString(),
      ...data
    };
    sendToParent('entities:create', { entity: newEntity });
    return newEntity;
  },
  
  async update(id, data) {
    sendToParent('entities:update', { id, data });
    return { id, ...data };
  },
  
  async delete(id) {
    sendToParent('entities:delete', { id });
    return { success: true };
  }
};

// Mock EntityRule entity
export const EntityRule = {
  async list() {
    sendToParent('entityRules:list', {});
    return [];
  },
  
  async create(data) {
    const newEntityRule = {
      id: Date.now().toString(),
      ...data
    };
    sendToParent('entityRules:create', { entityRule: newEntityRule });
    return newEntityRule;
  }
};

// Mock PlaidItem entity
export const PlaidItem = {
  async list() {
    sendToParent('plaidItems:list', {});
    return [];
  }
};

// Mock AccessToken entity
export const AccessToken = {
  async list() {
    sendToParent('accessTokens:list', {});
    return [];
  },
  
  async create(data) {
    const newToken = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    sendToParent('accessTokens:create', { token: newToken });
    return newToken;
  }
};

// Mock User auth
export const User = {
  async getCurrentUser() {
    sendToParent('user:getCurrent', {});
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User'
    };
  },
  
  async signOut() {
    sendToParent('user:signOut', {});
    return { success: true };
  }
};

// Export the communication helpers
export { sendToParent, listenToParent }; 