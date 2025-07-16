import { useState, useEffect, useCallback } from 'react';
import { ruleApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useRules = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ruleApi.list();
      setRules(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRule = useCallback(async (ruleData) => {
    try {
      const response = await ruleApi.create(ruleData);
      setRules(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateRule = useCallback(async (id, ruleData) => {
    try {
      const response = await ruleApi.update(id, ruleData);
      setRules(prev => prev.map(rule => rule.id === id ? response.data : rule));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteRule = useCallback(async (id) => {
    try {
      await ruleApi.delete(id);
      setRules(prev => prev.filter(rule => rule.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const applyRule = useCallback(async (id) => {
    try {
      await ruleApi.apply(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const applyAllRules = useCallback(async () => {
    try {
      await ruleApi.applyAll();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    isLoading,
    error,
    refetch: fetchRules,
    createRule,
    updateRule,
    deleteRule,
    applyRule,
    applyAllRules,
  };
};

export const useRule = (id) => {
  const [rule, setRule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRule = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await ruleApi.get(id);
      setRule(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRule();
  }, [fetchRule]);

  return {
    rule,
    isLoading,
    error,
    refetch: fetchRule,
  };
};

export const useRuleTest = () => {
  const { execute, isLoading, error } = useApiCall();

  const testRule = useCallback(async (rule, transactions) => {
    return execute(() => ruleApi.test(rule, transactions));
  }, [execute]);

  return {
    testRule,
    isLoading,
    error,
  };
}; 