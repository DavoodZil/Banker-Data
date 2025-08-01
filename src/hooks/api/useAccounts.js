/**
 * useAccounts Hook
 * 
 * Custom hook for account operations.
 * Follows React best practices for data fetching.
 */

import { useState, useCallback, useEffect } from 'react';
import { accountApi } from '@/api/client';
import { useToast } from '@/components/ui/use-toast';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all accounts
  const fetchAccounts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.list(params);
      const data = response.data;
      setAccounts(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch accounts';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get single account
  const getAccount = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.get(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch account';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create account
  const createAccount = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.create(data);
      const newAccount = response.data;
      setAccounts(prev => [...prev, newAccount]);
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
      return newAccount;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update account
  const updateAccount = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.update(id, data);
      const updatedAccount = response.data;
      setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
      toast({
        title: 'Success',
        description: 'Account updated successfully',
      });
      return updatedAccount;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete account
  const deleteAccount = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await accountApi.delete(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      toast({
        title: 'Success',
        description: 'Account deleted successfully',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Sync account with bank
  const syncAccount = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.sync(id);
      toast({
        title: 'Success',
        description: 'Account sync initiated',
      });
      // Refresh account data
      await fetchAccounts();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to sync account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchAccounts]);

  // Get account balance history
  const getBalanceHistory = useCallback(async (id, params = {}) => {
    try {
      const response = await accountApi.getBalanceHistory(id, params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch balance history';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Connect Plaid account
  const connectPlaidAccount = useCallback(async (plaidData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.connectPlaid(plaidData);
      const newAccount = response.data;
      setAccounts(prev => [...prev, newAccount]);
      toast({
        title: 'Success',
        description: 'Bank account connected successfully',
      });
      return newAccount;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to connect bank account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Auto-fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    // State
    accounts,
    loading,
    isLoading: loading, // Alias for consistency
    error,
    
    // Actions
    fetchAccounts,
    refetch: fetchAccounts, // Alias for consistency
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    syncAccount,
    getBalanceHistory,
    connectPlaidAccount,
    
    // Computed values
    totalBalance: accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    accountCount: accounts.length,
  };
}

// Hook for single account
export function useAccount(accountId) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchAccount = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await accountApi.get(accountId);
      setAccount(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [accountId, toast]);

  // Auto-fetch on mount and when ID changes
  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const updateAccount = useCallback(async (data) => {
    if (!accountId) return;
    
    try {
      const response = await accountApi.update(accountId, data);
      setAccount(response.data);
      toast({
        title: 'Success',
        description: 'Account updated successfully',
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [accountId, toast]);

  return {
    account,
    loading,
    error,
    refetch: fetchAccount,
    updateAccount,
  };
}