import { useState, useEffect, useCallback } from 'react';
import { entityApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await entityApi.list();
      setEntities(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntity = useCallback(async (entityData) => {
    try {
      const response = await entityApi.create(entityData);
      setEntities(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateEntity = useCallback(async (id, entityData) => {
    try {
      const response = await entityApi.update(id, entityData);
      setEntities(prev => prev.map(entity => entity.id === id ? response.data : entity));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteEntity = useCallback(async (id) => {
    try {
      await entityApi.delete(id);
      setEntities(prev => prev.filter(entity => entity.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const linkAccount = useCallback(async (entityId, accountId) => {
    try {
      await entityApi.linkAccount(entityId, accountId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const unlinkAccount = useCallback(async (entityId, accountId) => {
    try {
      await entityApi.unlinkAccount(entityId, accountId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return {
    entities,
    isLoading,
    error,
    refetch: fetchEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    linkAccount,
    unlinkAccount,
  };
};

export const useEntity = (id) => {
  const [entity, setEntity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntity = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await entityApi.get(id);
      setEntity(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const getEntityTransactions = useCallback(async (params) => {
    if (!id) return;
    try {
      const response = await entityApi.getTransactions(id, params);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [id]);

  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  return {
    entity,
    isLoading,
    error,
    refetch: fetchEntity,
    getEntityTransactions,
  };
}; 