import { useState, useEffect, useCallback } from 'react';
import { goalApi } from '@/api/client';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await goalApi.list();
      // Handle the response structure - could be response.data.data or response.data
      const goalsData = response.data?.data || response.data || [];
      setGoals(Array.isArray(goalsData) ? goalsData : []);
    } catch (err) {
      setError(err.message);
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (goalData) => {
    try {
      const response = await goalApi.create(goalData);
      setGoals(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateGoal = useCallback(async (id, goalData) => {
    try {
      // API expects data with id included
      const response = await goalApi.update({ ...goalData, id });
      setGoals(prev => prev.map(goal => goal.id === id ? response.data : goal));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(async (id) => {
    try {
      // API expects data with id included
      await goalApi.delete({ id });
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    isLoading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};