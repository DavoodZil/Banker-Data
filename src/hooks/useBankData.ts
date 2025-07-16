import { useState, useEffect } from 'react';
import api from '@/services/api';

export const useBankData = () => {
  const [bankData, setBankData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBankData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/bank-data');
      console.log('Bank Data API Response:', response.data);
      setBankData(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching bank data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bank data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch bank data when hook is initialized
    fetchBankData();
  }, []);

  return {
    bankData,
    isLoading,
    error,
    fetchBankData,
    refetch: fetchBankData
  };
}; 