/**
 * useCategories Hook
 * 
 * Custom hook for category operations.
 * Handles category hierarchy and budget management.
 */

import { useState, useCallback, useEffect } from 'react';
import { categoryApi } from '@/api/client';
import { useToast } from '@/components/ui/use-toast';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.list();
      
      // Handle the specific API response structure
      if (response.data?.success && response.data?.data) {
        const { categories: userCategories = [], yd_categories = [] } = response.data.data;
        setCategories(userCategories);
        return { categories: userCategories, yd_categories };
      }
      
      setCategories([]);
      return { categories: [], yd_categories: [] };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
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

  // Create category
  const createCategory = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.create({
        name: data.name,
        parent: data.parent_category || null,
      });
      
      // Refresh categories after creation
      await fetchCategories();
      
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create category';
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
  }, [fetchCategories, toast]);

  // Update category
  const updateCategory = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.update(id, {
        id,
        name: data.name,
        yd_category_id: data.yd_category_id,
      });
      
      // Refresh categories after update
      await fetchCategories();
      
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update category';
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
  }, [fetchCategories, toast]);

  // Delete category
  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryApi.delete(id);
      
      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete category';
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

  // Get category hierarchy
  const getCategoryHierarchy = useCallback(async () => {
    try {
      const response = await categoryApi.getHierarchy();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category hierarchy';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  // Get popular categories
  const getPopularCategories = useCallback(async (limit = 10) => {
    try {
      const response = await categoryApi.getPopular(limit);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch popular categories:', err);
      return [];
    }
  }, []);

  // Merge categories
  const mergeCategories = useCallback(async (sourceId, targetId) => {
    setLoading(true);
    try {
      const response = await categoryApi.merge(sourceId, targetId);
      
      // Refresh categories after merge
      await fetchCategories();
      
      toast({
        title: 'Success',
        description: 'Categories merged successfully',
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to merge categories';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, toast]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    // State
    categories,
    loading,
    error,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryHierarchy,
    getPopularCategories,
    mergeCategories,
    
    // Computed values
    categoryCount: categories.length,
    getCategoryById: (id) => categories.find(cat => cat.id === id),
    getCategoriesByType: (type) => categories.filter(cat => cat.type === type),
  };
}

// Hook for category selection with search
export function useCategorySearch(categories = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(lowercaseSearch) ||
      category.parent?.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return {
    searchTerm,
    setSearchTerm,
    filteredCategories,
    clearSearch: () => setSearchTerm(''),
  };
}

// Hook for category budget tracking
export function useCategoryBudget(categoryId) {
  const [budget, setBudget] = useState(null);
  const [spending, setSpending] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBudgetData = useCallback(async (params = {}) => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      // This would be a specific endpoint for budget comparison
      // For now, using a placeholder
      const response = await categoryApi.get(categoryId);
      const categoryData = response.data;
      
      setBudget(categoryData.budget_amount || 0);
      // Spending would come from a different endpoint
      setSpending(0); // Placeholder
      
      return { budget: categoryData.budget_amount || 0, spending: 0 };
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const updateBudget = useCallback(async (amount) => {
    if (!categoryId) return;
    
    try {
      const response = await categoryApi.update(categoryId, { budget_amount: amount });
      setBudget(amount);
      
      toast({
        title: 'Success',
        description: 'Budget updated successfully',
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update budget';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [categoryId, toast]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return {
    budget,
    spending,
    loading,
    updateBudget,
    refetch: fetchBudgetData,
    percentUsed: budget > 0 ? (spending / budget) * 100 : 0,
    remaining: budget - spending,
    isOverBudget: spending > budget,
  };
}