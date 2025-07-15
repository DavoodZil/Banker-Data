import { useState, useEffect } from 'react';
import api from '@/services/api';

export const usePlaidLinkToken = (isOpen) => {
  const [linkToken, setLinkToken] = useState(null);
  const [linkKey ,setLinkKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLinkToken = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/bank-account-verify/plaid/get-link-token',{sourceType:1});
      
      if (response.data.data.token) {
        setLinkToken(response.data.data.token);
        setLinkKey(response.data.data.key);
        return response.data.data.token;
      } else {
        throw new Error(response.data.error || "Failed to retrieve link token");
      }
    } catch (err) {
      console.error('Error fetching Plaid link token:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get Plaid link token';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLinkToken();
    }
  }, [isOpen]);

  return {
    linkToken,
    isLoading,
    linkKey,
    error,
    fetchLinkToken,
    refetch: fetchLinkToken
  };
}; 
