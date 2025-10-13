import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function BudgetTracking({
  categories,
  transactions,
  isLoading,
}) {
  if (isLoading) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-common-green" />
            Budget Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  // Calculate spending by category for current month
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const categorySpending = {};
  transactions
    .filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= monthStart &&
        transactionDate <= monthEnd &&
        t.amount < 0
      );
    })
    .forEach((t) => {
      const category = t.category || 'uncategorized';
      categorySpending[category] =
        (categorySpending[category] || 0) + Math.abs(t.amount);
    });

  // Get categories with budgets and their spending
  const budgetedCategories = categories
    .filter((cat) => cat.budget_amount > 0)
    .map((cat) => {
      const spent = categorySpending[cat.name] || 0;
      const budget = cat.budget_amount;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      const isOverBudget = percentage > 100;
      const remaining = Math.max(0, budget - spent);

      return {
        ...cat,
        spent,
        budget,
        percentage,
        isOverBudget,
        remaining,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const totalBudget = budgetedCategories.reduce(
    (sum, cat) => sum + cat.budget,
    0
  );
  const totalSpent = budgetedCategories.reduce(
    (sum, cat) => sum + cat.spent,
    0
  );
  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (budgetedCategories.length === 0) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-common-green" />
            Budget Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="w-12 h-12 bg-common-gray-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-common-gray-dark" />
          </div>
          <h3 className="text-lg font-semibold text-common-gray-dark mb-2">
            No Budgets Set
          </h3>
          <p className="text-sm text-common-gray-dark">
            Create category budgets to track your spending goals
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-common-green" />
            Budget Tracking
          </CardTitle>
          <Badge
            variant={overallPercentage > 90 ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {overallPercentage.toFixed(0)}% Used
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Budget Summary - Compact */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-common-gray-dark">
              Total Budget
            </span>
            <span className="text-sm font-bold text-common-gray-dark">
              ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-common-gray-light rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                overallPercentage > 100
                  ? 'bg-common-red-secondary0'
                  : overallPercentage > 80
                    ? 'bg-common-yellow-secondary0'
                    : 'bg-common-green-secondary0'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-common-gray-dark">
              ${Math.max(0, totalBudget - totalSpent).toLocaleString()}{' '}
              remaining
            </span>
            <span
              className={`font-medium ${
                overallPercentage > 100
                  ? 'text-common-red'
                  : overallPercentage > 80
                    ? 'text-common-yellow'
                    : 'text-common-green'
              }`}
            >
              {overallPercentage > 100
                ? `${(overallPercentage - 100).toFixed(0)}% over`
                : `${(100 - overallPercentage).toFixed(0)}% left`}
            </span>
          </div>
        </div>

        {/* Individual Category Budgets - More Compact */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {budgetedCategories.slice(0, 6).map((category) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color || '#6b7280' }}
                  />
                  <span className="text-sm font-medium capitalize text-common-gray-dark truncate">
                    {category.name}
                  </span>
                  {category.isOverBudget && (
                    <AlertTriangle className="w-3 h-3 text-common-red flex-shrink-0" />
                  )}
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs font-semibold text-common-gray-dark">
                    ${category.spent.toLocaleString()}
                  </div>
                  <div className="text-xs text-common-gray-dark">
                    of ${category.budget.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="w-full bg-common-gray-light rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    category.isOverBudget
                      ? 'bg-common-red-secondary0'
                      : category.percentage > 80
                        ? 'bg-common-yellow-secondary0'
                        : 'bg-common-green-secondary0'
                  }`}
                  style={{
                    width: `${Math.min(100, category.percentage)}%`,
                  }}
                />
              </div>
            </div>
          ))}

          {budgetedCategories.length > 6 && (
            <div className="text-center text-xs text-common-gray-dark pt-2 border-t">
              +{budgetedCategories.length - 6} more categories
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}








