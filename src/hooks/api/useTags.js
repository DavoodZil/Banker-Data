import { useState, useEffect, useCallback } from 'react';
import { tagApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tagApi.list();
      setTags(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTag = useCallback(async (tagData) => {
    try {
      const response = await tagApi.create(tagData);
      setTags(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTag = useCallback(async (id, tagData) => {
    try {
      const response = await tagApi.update(id, tagData);
      setTags(prev => prev.map(tag => tag.id === id ? response.data : tag));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTag = useCallback(async (id) => {
    try {
      await tagApi.delete(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getPopularTags = useCallback(async (limit = 20) => {
    try {
      const response = await tagApi.getPopular(limit);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags,
    createTag,
    updateTag,
    deleteTag,
    getPopularTags,
  };
};

export const useTagSuggestions = () => {
  const { execute, isLoading, error } = useApiCall();

  const getSuggestions = useCallback(async (transactionData) => {
    return execute(() => tagApi.getSuggestions(transactionData));
  }, [execute]);

  return {
    getSuggestions,
    isLoading,
    error,
  };
}; 