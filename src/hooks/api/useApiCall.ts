/**
 * useApiCall Hook
 * 
 * Generic hook for making API calls with loading and error states.
 * Useful for one-off API calls that don't need a full custom hook.
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useApiCall() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(async (apiFunction: any, options: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      const responseData = response?.data || response;
      setData(responseData);
      
      // Show success message if provided
      if (options.successMessage) {
        toast({
          title: 'Success',
          description: options.successMessage,
        });
      }
      
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      // Show error message unless explicitly disabled
      if (options.showError !== false) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      // Re-throw if caller wants to handle the error
      if (options.throwError) {
        throw err;
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Variant for mutations (create, update, delete)
export function useMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const mutate = useCallback(async (apiFunction, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      const responseData = response?.data || response;
      
      // Show success message
      if (options.successMessage) {
        toast({
          title: 'Success',
          description: options.successMessage,
        });
      }
      
      // Call onSuccess callback if provided
      if (options && options.onSuccess) {
        options.onSuccess(responseData);
      }
      
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      // Show error message
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Call onError callback if provided
      if (options && options.onError) {
        options.onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    mutate,
    loading,
    error,
  };
}