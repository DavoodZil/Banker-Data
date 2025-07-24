/**
 * API Client Functions
 * 
 * Simple functions for API calls, not classes.
 * These will be used by custom hooks.
 */

import api from '@/services/api';

// Account API functions
export const accountApi = {
  list: (params = {}) => api.get('/bank-data/accounts', { params }),
  get: (id) => api.get(`/bank-data/accounts/${id}`),
  create: (data) => api.post('/bank-data/accounts', data),
  update: (id, data) => api.put(`/bank-data/accounts/${id}`, data),
  patch: (id, data) => api.patch(`/bank-data/accounts/${id}`, data),
  delete: (id) => api.delete(`/bank-data/accounts/${id}`),
  
  // Account-specific endpoints
  getBalanceHistory: (id, params) => api.get(`/bank-data/accounts/${id}/balance-history`, { params }),
  sync: (id) => api.post(`/bank-data/accounts/${id}/sync`),
  getTransactions: (id, params) => api.get(`/bank-data/accounts/${id}/transactions`, { params }),
  connectPlaid: (data) => api.post('/bank-data/accounts/connect-plaid', data),
  disconnect: (id) => api.post(`/bank-data/accounts/${id}/disconnect`),
};

// Transaction API functions
export const transactionApi = {
  list: (params = {}) => api.get('/bank-data/transactions', { params }),
  get: (id) => api.get(`/bank-data/transactions/${id}`),
  create: (data) => api.post('/bank-data/transactions', data),
  update: (id, data) => api.put(`/bank-data/transactions/${id}`, data),
  patch: (id, data) => api.patch(`/bank-data/transactions/${id}`, data),
  delete: (id) => api.delete(`/bank-data/transactions/${id}`),
  
  // Transaction-specific endpoints
  categorize: (id, categoryId) => api.patch(`/bank-data/transactions/${id}`, { category_id: categoryId }),
  bulkCategorize: (data) => api.post('/bank-data/transactions/bulk-categorize', data),
  split: (id, splits) => api.post(`/bank-data/transactions/${id}/split`, { splits }),
  addTags: (id, tagIds) => api.post(`/bank-data/transactions/${id}/tags`, { tag_ids: tagIds }),
  removeTags: (id, tagIds) => api.delete(`/bank-data/transactions/${id}/tags`, { data: { tag_ids: tagIds } }),
  
  // Analytics
  getStatistics: (params) => api.get('/bank-data/transactions/statistics', { params }),
  getSpendingByCategory: (params) => api.get('/bank-data/transactions/spending-by-category', { params }),
  getSpendingByMerchant: (params) => api.get('/bank-data/transactions/spending-by-merchant', { params }),
};

// Category API functions
export const categoryApi = {
  list: (params = {}) => api.get('/bank-data/categories', { params }),
  get: (id) => api.get(`/bank-data/categories/${id}`),
  create: (data) => api.post('/bank-data/categories', data),
  update: (id, data) => api.put(`/bank-data/categories/${id}`, data),
  delete: (id) => api.delete(`/bank-data/categories/${id}`),
  
  // Category-specific endpoints
  getHierarchy: () => api.get('/bank-data/categories/hierarchy'),
  getPopular: (limit = 10) => api.get('/bank-data/categories/popular', { params: { limit } }),
  merge: (sourceId, targetId) => api.post('/bank-data/categories/merge', { source_id: sourceId, target_id: targetId }),
};

// Rule API functions
export const ruleApi = {
  list: (params = {}) => api.get('/bank-data/rules', { params }),
  get: (id) => api.get(`/bank-data/rules/${id}`),
  create: (data) => api.post('/bank-data/rules', data),
  update: (id, data) => api.put(`/bank-data/rules/${id}`, data),
  delete: (id) => api.delete(`/bank-data/rules/${id}`),
  
  // Rule-specific endpoints
  test: (rule, transactions) => api.post('/bank-data/rules/test', { rule, transactions }),
  apply: (id) => api.post(`/bank-data/rules/${id}/apply`),
  applyAll: () => api.post('/bank-data/rules/apply-all'),
};

// Tag API functions
export const tagApi = {
  list: () => api.get('/bank-data/tags'),
  create: (data) => api.post('/bank-data/tag', data),
  update: (data) => api.put('/bank-data/tag', data), // data includes id
  delete: (data) => api.delete('/bank-data/tag', { data }), // data includes id
  
  // Keep these for backwards compatibility if needed
  get: (id) => api.get(`/bank-data/tags/${id}`),
  getPopular: (limit = 20) => api.get('/bank-data/tags/popular', { params: { limit } }),
  getSuggestions: (transactionData) => api.post('/bank-data/tags/suggestions', transactionData),
};

// Entity API functions
export const entityApi = {
  list: (params = {}) => api.get('/bank-data/entities', { params }),
  get: (id) => api.get(`/bank-data/entities/${id}`),
  create: (data) => api.post('/bank-data/entities', data),
  update: (id, data) => api.put(`/bank-data/entities/${id}`, data),
  delete: (id) => api.delete(`/bank-data/entities/${id}`),
  
  // Entity-specific endpoints
  linkAccount: (entityId, accountId) => api.post(`/bank-data/entities/${entityId}/link-account`, { account_id: accountId }),
  unlinkAccount: (entityId, accountId) => api.delete(`/bank-data/entities/${entityId}/link-account/${accountId}`),
  getTransactions: (entityId, params) => api.get(`/bank-data/entities/${entityId}/transactions`, { params }),
};

// Merchant API functions
export const merchantApi = {
  list: (params = {}) => api.get('/bank-data/merchants', { params }),
  get: (id) => api.get(`/bank-data/merchants/${id}`),
  create: (data) => api.post('/bank-data/merchants', data),
  update: (id, data) => api.put(`/bank-data/merchants/${id}`, data),
  delete: (id) => api.delete(`/bank-data/merchants/${id}`),
  
  // Merchant-specific endpoints
  search: (query) => api.get('/bank-data/merchants/search', { params: { q: query } }),
  getTopBySpending: (params) => api.get('/bank-data/merchants/top-by-spending', { params }),
};

// Plaid API functions
export const plaidApi = {
  getLinkToken: () => api.post('/bank-data/plaid/link-token'),
  exchangePublicToken: (publicToken) => api.post('/bank-data/plaid/exchange-token', { public_token: publicToken }),
  getInstitutions: () => api.get('/bank-data/plaid/institutions'),
  syncTransactions: (itemId) => api.post(`/bank-data/plaid/items/${itemId}/sync`),
  removeItem: (itemId) => api.delete(`/bank-data/plaid/items/${itemId}`),
};

// File API functions
export const fileApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/bank-data/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  
  process: (fileId, options) => api.post(`/bank-data/files/${fileId}/process`, options),
  getStatus: (fileId) => api.get(`/bank-data/files/${fileId}/status`),
  download: (fileId) => api.get(`/bank-data/files/${fileId}/download`, { responseType: 'blob' }),
  delete: (fileId) => api.delete(`/bank-data/files/${fileId}`),
  extractData: (fileId) => api.post(`/bank-data/files/${fileId}/extract`),
};

// Access Token API functions
export const accessTokenApi = {
  list: () => api.get('/bank-data/access-tokens'),
  generate: (data) => api.post('/bank-data/access-tokens', data),
  revoke: (tokenId) => api.delete(`/bank-data/access-tokens/${tokenId}`),
};