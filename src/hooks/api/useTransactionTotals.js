import { useState, useEffect } from 'react';
import { transactionApi } from '@/api/client';

export const useTransactionTotals = (filters = {}) => {
  const [totals, setTotals] = useState({
    total: '0',
    count: '0', 
    credit: '0',
    debit: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotals = async (filterPayload) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionApi.getTotalsAggrid(filterPayload);
      
      // Handle the response - it comes directly as the data object
      if (response.data) {
        setTotals(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch transaction totals:', err);
      setError(err.message || 'Failed to fetch totals');
      
      // Reset to zero on error
      setTotals({
        total: '0',
        count: '0',
        credit: '0', 
        debit: '0'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      fetchTotals(filters);
    }
  }, [filters]);

  return {
    totals,
    loading,
    error,
    refetch: () => fetchTotals(filters)
  };
};