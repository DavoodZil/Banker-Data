
import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, TrendingDown, Target, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import CategoryCard from "../components/categories/CategoryCard";
import AddCategoryModal from "../components/categories/AddCategoryModal";
import CategorySummaryCards from "../components/categories/CategorySummaryCards";

// Skeleton component for category cards
function CategoryCardSkeleton() {
  return (
    <Card className="bg-white border-gray-100 h-full">
      <CardContent className="p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>

        {/* Amount Section */}
        <div className="mb-4">
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Budget Progress Skeleton */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Categories() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Use the new hooks
  const { categories, loading: isLoading, error, fetchCategories: refetchCategories, createCategory, updateCategory } = useCategories();

  useEffect(() => {
    // Data is automatically loaded by the hooks
  }, []);

  const loadData = async () => {
    await refetchCategories();
  };

  const handleAddCategory = async (categoryData) => {
    setIsSaving(true);
    try {
      // Clean the name before sending to API
      console.log(categoryData);
      const cleanedData = {
        ...categoryData,
        name: categoryData.name ? categoryData.name.replace(/&nbsp;/g, ' ').trim() : categoryData.name
      };
      await createCategory(cleanedData);
      loadData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add category:', error);
      // Error toast is handled by the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (categoryId, updates) => {
    setIsSaving(true);
    try {
      // Clean the name before sending to API
      const cleanedUpdates = {
        id: categoryId,
        name: updates.name ? updates.name.replace(/&nbsp;/g, ' ').trim() : updates.name,
        yd_category_id: updates.budget_amount ? parseFloat(updates.budget_amount) : undefined
      };
      await updateCategory(categoryId, cleanedUpdates);
      loadData();
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      // Error toast is handled by the hook
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryStats = (category) => {
    // Use the transactions_count from the category data itself
    return {
      transactionCount: category.transactions_count || 0,
      totalSpent: 0, // This will be provided by the API summary
      averageAmount: 0
    };
  };

  const defaultCategories = [
    { name: 'groceries', color: '#10b981', icon: '🛒' },
    { name: 'dining', color: '#f59e0b', icon: '🍽️' },
    { name: 'transportation', color: '#3b82f6', icon: '🚗' },
    { name: 'entertainment', color: '#8b5cf6', icon: '🎬' },
    { name: 'utilities', color: '#ef4444', icon: '⚡' },
    { name: 'healthcare', color: '#06b6d4', icon: '🏥' },
    { name: 'shopping', color: '#ec4899', icon: '🛍️' },
    { name: 'travel', color: '#84cc16', icon: '✈️' },
    { name: 'income', color: '#10b981', icon: '💰' },
    { name: 'investments', color: '#6366f1', icon: '📊' }
  ];

  // Clean category names
  const allCategories = categories.map(category => ({
    ...category,
    name: category.name ? category.name.replace(/&nbsp;/g, ' ').trim() : category.name
  }));

  const filteredCategories = allCategories.filter(category =>
    category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoriesWithSpending = filteredCategories
    .map(category => ({
      ...category,
      stats: getCategoryStats(category)
    }))
    .sort((a, b) => (b.transactions_count || 0) - (a.transactions_count || 0));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your spending • {allCategories.length} categories
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-4 py-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <CategorySummaryCards filters={{}} />

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {categoriesWithSpending.map((category, index) => (
            <CategoryCard
              key={category.enc_id || category.id || `${category.name}-${index}`}
              category={category}
              stats={category.stats}
              onEdit={() => setEditingCategory(category)}
              compact={true}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200 text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No categories found
              </h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                {searchQuery ? `No categories match "${searchQuery}"` : 'Create your first category to organize transactions'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Create Your First Category
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal || !!editingCategory}
        onClose={() => {
          setShowAddModal(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? 
          (data) => handleUpdateCategory(editingCategory.id, data) : 
          handleAddCategory
        }
        category={editingCategory}
        isSaving={isSaving}
      />
    </div>
  );
}
