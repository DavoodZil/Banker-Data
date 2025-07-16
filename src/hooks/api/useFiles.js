import { useState, useCallback } from 'react';
import { fileApi } from '@/api/client';
import { useApiCall } from './useApiCall';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { execute, isLoading, error } = useApiCall();

  const uploadFile = useCallback(async (file) => {
    setUploadProgress(0);
    setUploadedFile(null);
    
    const onUploadProgress = (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(progress);
    };

    try {
      const response = await execute(() => fileApi.upload(file, onUploadProgress));
      setUploadedFile(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [execute]);

  const processFile = useCallback(async (fileId, options = {}) => {
    try {
      const response = await execute(() => fileApi.process(fileId, options));
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [execute]);

  const getFileStatus = useCallback(async (fileId) => {
    try {
      const response = await execute(() => fileApi.getStatus(fileId));
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [execute]);

  const downloadFile = useCallback(async (fileId) => {
    try {
      const response = await execute(() => fileApi.download(fileId));
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [execute]);

  const deleteFile = useCallback(async (fileId) => {
    try {
      await execute(() => fileApi.delete(fileId));
    } catch (err) {
      throw err;
    }
  }, [execute]);

  return {
    uploadFile,
    processFile,
    getFileStatus,
    downloadFile,
    deleteFile,
    uploadProgress,
    uploadedFile,
    isLoading,
    error,
  };
};

export const useFileImport = () => {
  const { execute, isLoading, error } = useApiCall();

  const extractData = useCallback(async (fileId) => {
    try {
      const response = await execute(() => fileApi.extractData(fileId));
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [execute]);

  return {
    extractData,
    isLoading,
    error,
  };
}; 