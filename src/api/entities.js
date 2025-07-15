// Entities for iframe integration
// These will communicate with the parent Angular application via postMessage
// and also make real API calls

import { mockAccounts, mockTransactions, mockCategories, mockTags, mockRules, mockFinancialEntities } from './mockData.js';
import { categoryAPI, transactionAPI } from './functions.js';

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

// Transaction entity with real API integration
export const Transaction = {
  async list(sortBy = '-date', limit = 500, filters = {}) {
    try {
      // Make real API call
      const transactions = await transactionAPI.list(sortBy, limit, filters);
      sendToParent('transactions:list', { filters, transactions });
      return transactions;
    } catch (error) {
      console.error('Failed to fetch transactions from API, falling back to mock data:', error);
      sendToParent('transactions:list', { filters, transactions: mockTransactions });
      return mockTransactions;
    }
  },
  
  async get(id) {
    try {
      // Make real API call
      const transaction = await transactionAPI.get(id);
      sendToParent('transactions:get', { id, transaction });
      return transaction;
    } catch (error) {
      console.error('Failed to fetch transaction from API, falling back to mock data:', error);
      const mockTransaction = mockTransactions.find(t => t.id === id);
      sendToParent('transactions:get', { id, transaction: mockTransaction });
      return mockTransaction;
    }
  },
  
  async create(data) {
    try {
      // Make real API call
      const newTransaction = await transactionAPI.create({
        ...data,
        date: data.date || new Date().toISOString()
      });
      sendToParent('transactions:create', { transaction: newTransaction });
      return newTransaction;
    } catch (error) {
      console.error('Failed to create transaction via API, using mock response:', error);
      const mockTransaction = {
        id: Date.now().toString(),
        ...data,
        date: data.date || new Date().toISOString()
      };
      sendToParent('transactions:create', { transaction: mockTransaction });
      return mockTransaction;
    }
  },
  
  async update(id, data) {
    try {
      // Make real API call
      const updatedTransaction = await transactionAPI.update(id, data);
      sendToParent('transactions:update', { id, data: updatedTransaction });
      return updatedTransaction;
    } catch (error) {
      console.error('Failed to update transaction via API, using mock response:', error);
      sendToParent('transactions:update', { id, data });
      return { id, ...data };
    }
  },
  
  async delete(id) {
    try {
      // Make real API call
      const result = await transactionAPI.delete(id);
      sendToParent('transactions:delete', { id, result });
      return result;
    } catch (error) {
      console.error('Failed to delete transaction via API, using mock response:', error);
      sendToParent('transactions:delete', { id });
      return { success: true };
    }
  }
};

// Category entity with real API integration
export const Category = {
  async list(sortBy = '-updated_date') {
    try {
      // Make real API call
      const categories = await categoryAPI.list(sortBy);
      sendToParent('categories:list', { categories });
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories from API, falling back to mock data:', error);
      sendToParent('categories:list', { categories: mockCategories });
      return mockCategories;
    }
  },
  
  async create(data) {
    try {
      // Make real API call
      const newCategory = await categoryAPI.create(data);
      sendToParent('categories:create', { category: newCategory });
      return newCategory;
    } catch (error) {
      console.error('Failed to create category via API, using mock response:', error);
      const mockCategory = {
        id: Date.now().toString(),
        ...data
      };
      sendToParent('categories:create', { category: mockCategory });
      return mockCategory;
    }
  },
  
  async update(id, data) {
    try {
      // Make real API call
      const updatedCategory = await categoryAPI.update(id, data);
      sendToParent('categories:update', { id, data: updatedCategory });
      return updatedCategory;
    } catch (error) {
      console.error('Failed to update category via API, using mock response:', error);
      sendToParent('categories:update', { id, data });
      return { id, ...data };
    }
  },
  
  async delete(id) {
    try {
      // Make real API call
      const result = await categoryAPI.delete(id);
      sendToParent('categories:delete', { id, result });
      return result;
    } catch (error) {
      console.error('Failed to delete category via API, using mock response:', error);
      sendToParent('categories:delete', { id });
      return { success: true };
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