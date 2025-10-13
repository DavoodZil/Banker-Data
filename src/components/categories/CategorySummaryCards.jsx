import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategorySummary } from '@/hooks/api/useCategorySummary';

export default function CategorySummaryCards({ filters = {} }) {
  const { summary, loading, error } = useCategorySummary(filters);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white border-common-gray-light">
            <CardContent className="p-4">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-common-gray-light">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-common-gray-dark uppercase tracking-wide mb-1">
              Error
            </div>
            <div className="text-sm text-common-red">Failed to load summary</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse numbers from string values, removing commas
  const parseNumber = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return parseFloat(value.replace(/,/g, '')) || 0;
    }
    return 0;
  };

  const totalCategories = parseNumber(summary.total_categories);
  const totalSpent = parseNumber(summary.total_spent);
  const activeCategories = parseNumber(summary.active_categories);
  const avgPerCategory = parseNumber(summary.avg_per_category);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border-common-gray-light hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="text-xs font-medium text-common-gray-dark uppercase tracking-wide mb-1">
            Total Categories
          </div>
          <div className="text-2xl font-bold text-common-gray-dark">
            {totalCategories.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-common-gray-light hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="text-xs font-medium text-common-gray-dark uppercase tracking-wide mb-1">
            Total Spent
          </div>
          <div className="text-2xl font-bold text-common-red">
            ${totalSpent.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-common-gray-light hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="text-xs font-medium text-common-gray-dark uppercase tracking-wide mb-1">
            Active Categories
          </div>
          <div className="text-2xl font-bold text-common-green">
            {activeCategories.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-common-gray-light hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="text-xs font-medium text-common-gray-dark uppercase tracking-wide mb-1">
            Avg per Category
          </div>
          <div className="text-2xl font-bold text-common-gray-dark">
            ${avgPerCategory.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}








