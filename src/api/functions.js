// Mock functions for iframe integration
// These will communicate with the parent Angular application via postMessage

import { sendToParent } from './entities.js';
import axios from 'axios';
import api from '@/services/api';
import { API_CONFIG, buildApiUrl, handleApiError } from './config.js';

// Mock Plaid integration functions
export const createLinkToken = async () => {
  sendToParent('plaid:createLinkToken', {});
  return {
    linkToken: 'mock-link-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  };
};

export const exchangePublicToken = async ({ public_token, institution, key, metadata }) => {

  const payload = {
    public_token: public_token,
    key: key,
    institutionName: institution?.name || null,
    institutionId: institution?.institution_id || null,
    metadata: metadata
  };
  const response = await axios.post('https://1614008f199c.ngrok-free.app/api/plaid/callback', payload);
  return response.data;
};

export const plaidWebhook = async (webhookData) => {
  sendToParent('plaid:webhook', { webhookData });
  return { success: true };
};

export const removeAccount = async (accountId) => {
  sendToParent('accounts:remove', { accountId });
  return { success: true };
};

export const removeAllAccounts = async () => {
  sendToParent('accounts:removeAll', {});
  return { success: true };
};

export const syncTransactions = async (accountId) => {
  sendToParent('transactions:sync', { accountId });
  return {
    success: true,
    syncedCount: Math.floor(Math.random() * 10) + 1
  };
};

export const verifyPlaidIntegration = async () => {
  sendToParent('plaid:verify', {});
  return {
    verified: true,
    accounts: [
      { id: '1', name: 'Checking Account', institution: 'Chase Bank' },
      { id: '2', name: 'Savings Account', institution: 'Wells Fargo' }
    ]
  };
};

export const triggerWebhookSync = async () => {
  sendToParent('webhook:sync', {});
  return { success: true };
};

export const fetchFromNgrok = async (url) => {
  sendToParent('ngrok:fetch', { url });
  return { data: 'mock-ngrok-data' };
};

export const plaidClient = {
  async accountsGet(accessToken) {
    sendToParent('plaid:accountsGet', { accessToken });
    return {
      accounts: [
        { account_id: '1', name: 'Checking', type: 'depository' },
        { account_id: '2', name: 'Savings', type: 'depository' }
      ]
    };
  },
  
  async transactionsGet(accessToken, startDate, endDate) {
    sendToParent('plaid:transactionsGet', { accessToken, startDate, endDate });
    return {
      transactions: [
        {
          transaction_id: '1',
          amount: -45.67,
          name: 'Grocery Store',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };
  }
};

export const generateAccessToken = async (userId) => {
  sendToParent('auth:generateToken', { userId });
  return {
    accessToken: 'mock-generated-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  };
};

export const revokeAccessToken = async (tokenId) => {
  sendToParent('auth:revokeToken', { tokenId });
  return { success: true };
};

// Mock API endpoints
export const api_v1_accounts = async () => {
  sendToParent('api:accounts', {});
  return [
    { id: '1', name: 'Checking Account', balance: 2500.00 },
    { id: '2', name: 'Savings Account', balance: 15000.00 }
  ];
};

export const api_v1_transactions = async () => {
  sendToParent('api:transactions', {});
  return [
    { id: '1', amount: -45.67, description: 'Grocery Store' },
    { id: '2', amount: -120.00, description: 'Gas Station' }
  ];
}; 

// Category API functions
export const categoryAPI = {
  // Get all categories
  async list(sortBy = API_CONFIG.SORTING.CATEGORIES.DEFAULT) {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES, { sort: sortBy });
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw handleApiError(error);
    }
  },

  // Get a single category by ID
  async get(id) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw handleApiError(error);
    }
  },

  // Create a new category
  async create(categoryData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw handleApiError(error);
    }
  },

  // Update an existing category
  async update(id, categoryData) {
    try {
      const response = await api.put(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw handleApiError(error);
    }
  },

  // Delete a category
  async delete(id) {
    try {
      const response = await api.delete(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw handleApiError(error);
    }
  },

  // Get category statistics
  async getStats(categoryId) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw handleApiError(error);
    }
  }
};

// Transaction API functions
export const transactionAPI = {
  // Get all transactions with optional filters
  async list(sortBy = API_CONFIG.SORTING.TRANSACTIONS.DEFAULT, limit = API_CONFIG.PAGINATION.DEFAULT_LIMIT, filters = {}) {
    try {
      const params = {
        sort: sortBy,
        limit: Math.min(limit, API_CONFIG.PAGINATION.MAX_LIMIT),
        ...filters
      };
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.TRANSACTIONS, params);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw handleApiError(error);
    }
  },

  // Get a single transaction by ID
  async get(id) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw handleApiError(error);
    }
  },

  // Create a new transaction
  async create(transactionData) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.TRANSACTIONS, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw handleApiError(error);
    }
  },

  // Update an existing transaction
  async update(id, transactionData) {
    try {
      const response = await api.put(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw handleApiError(error);
    }
  },

  // Delete a transaction
  async delete(id) {
    try {
      const response = await api.delete(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw handleApiError(error);
    }
  }
}; 