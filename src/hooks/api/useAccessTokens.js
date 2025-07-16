import { useState, useEffect, useCallback } from 'react';
import { accessTokenApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useAccessTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTokens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await accessTokenApi.list();
      setTokens(response.data || []);
    } catch (err) {
      setError(err.message);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateToken = useCallback(async (name) => {
    try {
      const response = await accessTokenApi.generate({ name });
      await fetchTokens(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchTokens]);

  const revokeToken = useCallback(async (tokenId) => {
    try {
      await accessTokenApi.revoke(tokenId);
      await fetchTokens(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchTokens]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    refetch: fetchTokens,
    generateToken,
    revokeToken,
  };
}; 