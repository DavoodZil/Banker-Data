import { useState, useEffect } from 'react';
import api from '@/services/api';

export const useBankData = () => {
  const [bankData, setBankData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [error, setError] = useState(null);

  const fetchBankData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/bank-data');
      setBankData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bank data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const fetchDashboardSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/bank-data/summary');
      setDashboardSummary(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard summary');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch bank data when hook is initialized
    fetchBankData();
    fetchDashboardSummary();
  }, []);

  return {
    bankData,
    isLoading,
    error,
    dashboardSummary,
    fetchBankData,
    fetchDashboardSummary,
    refetch: fetchBankData
  };
}; 