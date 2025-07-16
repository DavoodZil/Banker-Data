import { useState, useEffect, useCallback } from 'react';
import { plaidApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const usePlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLinkToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await plaidApi.getLinkToken();
      setLinkToken(response.data.link_token);
      return response.data.link_token;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exchangePublicToken = useCallback(async (publicToken) => {
    try {
      const response = await plaidApi.exchangePublicToken(publicToken);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getInstitutions = useCallback(async () => {
    try {
      const response = await plaidApi.getInstitutions();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    linkToken,
    isLoading,
    error,
    getLinkToken,
    exchangePublicToken,
    getInstitutions,
  };
};

export const usePlaidAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncTransactions = useCallback(async (itemId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await plaidApi.syncTransactions(itemId);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      await plaidApi.removeItem(itemId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    accounts,
    isLoading,
    error,
    syncTransactions,
    removeItem,
  };
}; 