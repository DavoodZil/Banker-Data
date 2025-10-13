import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '@/api/client';

/**
 * Custom hook for fetching category summary data
 * @param {Object} filters - Filter parameters for the summary
 * @returns {Object} Summary data, loading state, error state, and refetch function
 */
export const useCategorySummary = (filters = {}) => {
  const [summary, setSummary] = useState({
    total_categories: 0,
    total_spent: '0',
    active_categories: 0,
    avg_per_category: '0',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches category summary data from the API
   * @param {Object} filterPayload - Filter parameters for the API call
   * @returns {Promise<void>}
   */
  const fetchSummary = useCallback(async (filterPayload = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryApi.getSummary(filterPayload);

      if (response.data && response.data.success && response.data.data) {
        setSummary(response.data.data);
      } else if (response.data) {
        setSummary(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(filters);
  }, [fetchSummary, filters]);

  return {
    summary,
    loading,
    error,
    refetch: () => fetchSummary(filters),
  };
};
