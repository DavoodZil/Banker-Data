// Mock functions for iframe integration
// These will communicate with the parent Angular application via postMessage

import { sendToParent } from './entities.js';
import axios from 'axios';

// Mock Plaid integration functions
export const createLinkToken = async () => {
  sendToParent('plaid:createLinkToken', {});
  return {
    linkToken: 'mock-link-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  };
};

export const exchangePublicToken = async ({ linkKey, institution }) => {

  const payload = {
    public_token: linkKey,
    key: linkKey,
    institutionName: institution?.name || null,
    institutionId: institution?.institution_id || null,
  };
  const response = await axios.post('https://master.api.ocw-api.sebipay.com/plaid/callback', payload);
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