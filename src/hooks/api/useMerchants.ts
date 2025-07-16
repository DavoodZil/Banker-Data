import { useState, useEffect, useCallback } from 'react';
import { merchantApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMerchants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await merchantApi.list();
      setMerchants(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMerchant = useCallback(async (merchantData) => {
    try {
      const response = await merchantApi.create(merchantData);
      setMerchants(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateMerchant = useCallback(async (id, merchantData) => {
    try {
      const response = await merchantApi.update(id, merchantData);
      setMerchants(prev => prev.map(merchant => merchant.id === id ? response.data : merchant));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteMerchant = useCallback(async (id) => {
    try {
      await merchantApi.delete(id);
      setMerchants(prev => prev.filter(merchant => merchant.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getTopBySpending = useCallback(async (params) => {
    try {
      const response = await merchantApi.getTopBySpending(params);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  return {
    merchants,
    isLoading,
    error,
    refetch: fetchMerchants,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    getTopBySpending,
  };
};

export const useMerchantSearch = () => {
  const { execute, loading, error } = useApiCall();
  const isLoading = loading;

  const searchMerchants = useCallback(async (query) => {
    return execute(() => merchantApi.search(query));
  }, [execute]);

  return {
    searchMerchants,
    isLoading,
    error,
  };
}; 