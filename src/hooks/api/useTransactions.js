/**
 * useTransactions Hook
 * 
 * Custom hook for transaction operations.
 * Includes pagination, filtering, and bulk operations.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { transactionApi } from '@/api/client';
import { useToast } from '@/components/ui/use-toast';

export function useTransactions(initialFilters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const { toast } = useToast();

  // Fetch transactions with filters and pagination
  const fetchTransactions = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    
    const params = {
      page: options.page || pagination.page,
      limit: options.limit || pagination.limit,
      ...filters,
      ...options.filters,
    };

    try {
      const response = await transactionApi.list(params);
      const { data, meta } = response.data;
      
      setTransactions(data || []);
      setPagination({
        page: meta?.page || params.page,
        limit: meta?.limit || params.limit,
        total: meta?.total || 0,
        totalPages: meta?.totalPages || Math.ceil((meta?.total || 0) / params.limit),
      });
      
      return { data, meta };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch transactions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Pagination helpers
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchTransactions({ page });
    }
  }, [fetchTransactions, pagination.totalPages]);

  const nextPage = useCallback(() => {
    goToPage(pagination.page + 1);
  }, [goToPage, pagination.page]);

  const prevPage = useCallback(() => {
    goToPage(pagination.page - 1);
  }, [goToPage, pagination.page]);

  // Create transaction
  const createTransaction = useCallback(async (data) => {
    try {
      const response = await transactionApi.create(data);
      const newTransaction = response.data;
      
      // Refresh list to maintain pagination
      await fetchTransactions();
      
      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });
      
      return newTransaction;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchTransactions, toast]);

  // Update transaction
  const updateTransaction = useCallback(async (id, data) => {
    try {
      const response = await transactionApi.update(id, data);
      const updatedTransaction = response.data;
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Categorize transaction
  const categorizeTransaction = useCallback(async (id, categoryId) => {
    try {
      const response = await transactionApi.categorize(id, categoryId);
      const updatedTransaction = response.data;
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to categorize transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Bulk categorize
  const bulkCategorize = useCallback(async (transactionIds, categoryId) => {
    setLoading(true);
    try {
      const categorizations = transactionIds.map(id => ({
        transactionId: id,
        categoryId,
      }));
      
      const response = await transactionApi.bulkCategorize({ categorizations });
      
      // Refresh list to get updated data
      await fetchTransactions();
      
      toast({
        title: 'Success',
        description: `${transactionIds.length} transactions categorized successfully`,
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to categorize transactions';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, toast]);

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionApi.delete(id);
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Split transaction
  const splitTransaction = useCallback(async (id, splits) => {
    try {
      const response = await transactionApi.split(id, splits);
      
      // Refresh to show new split transactions
      await fetchTransactions();
      
      toast({
        title: 'Success',
        description: 'Transaction split successfully',
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to split transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchTransactions, toast]);

  // Add tags
  const addTags = useCallback(async (id, tagIds) => {
    try {
      const response = await transactionApi.addTags(id, tagIds);
      const updatedTransaction = response.data;
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add tags';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    fetchTransactions();
  }, [filters]); // Only re-fetch when filters change

  return {
    // State
    transactions,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    categorizeTransaction,
    bulkCategorize,
    splitTransaction,
    addTags,
    
    // Filter management
    updateFilters,
    clearFilters,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
  };
}

// Hook for transaction search with debouncing
export function useTransactionSearch(debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceTimerRef = useRef(null);

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await transactionApi.list({ 
        q: searchQuery,
        limit: 10 
      });
      setResults(response.data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      search(newQuery);
    }, debounceMs);
  }, [search, debounceMs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    searching,
    setQuery: handleQueryChange,
    clearSearch: () => {
      setQuery('');
      setResults([]);
    },
  };
}

// Hook for transaction statistics
export function useTransactionStats(params = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, categoryResponse, merchantResponse] = await Promise.all([
        transactionApi.getStatistics(params),
        transactionApi.getSpendingByCategory(params),
        transactionApi.getSpendingByMerchant(params),
      ]);

      setStats({
        overview: statsResponse.data,
        byCategory: categoryResponse.data,
        byMerchant: merchantResponse.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}