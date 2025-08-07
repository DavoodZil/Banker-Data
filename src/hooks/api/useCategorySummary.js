import { useState, useEffect, useCallback, useRef } from 'react';
import { categoryApi } from '@/api/client';

export const useCategorySummary = (filters = {}) => {
  const [summary, setSummary] = useState({
    total_categories: 0,
    total_spent: '0',
    active_categories: 0,
    avg_per_category: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  const fetchSummary = useCallback(async (filterPayload = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryApi.getSummary(filterPayload);
      
      
      // Handle the response structure
      if (response.data && response.data.success && response.data.data) {
        setSummary(response.data.data);
      } else if (response.data) {
        // In case the response comes directly as data
        setSummary(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch category summary:', err);
      setError(err.message || 'Failed to fetch summary');
      
      // Reset to zero on error
      setSummary({
        total_categories: 0,
        total_spent: '0',
        active_categories: 0,
        avg_per_category: '0'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch once on mount, since categories page doesn't have dynamic filters
    if (!hasFetchedRef.current) {
      fetchSummary(filters);
      hasFetchedRef.current = true;
    }
  }, []); // Empty dependency array to run only once

  return {
    summary,
    loading,
    error,
    refetch: () => fetchSummary(filters)
  };
};