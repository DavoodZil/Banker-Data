import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionResponse } from "@/types/api.types";

interface CategoryBreakdownProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
}

const categoryColors: Record<string, string> = {
  groceries: "#10b981",
  dining: "#f59e0b",
  transportation: "#3b82f6",
  entertainment: "#8b5cf6",
  utilities: "#ef4444",
  healthcare: "#06b6d4",
  shopping: "#ec4899",
  travel: "#84cc16",
  uncategorized: "#6b7280"
};

export default function CategoryBreakdown({ transactions, isLoading }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getCategoryBreakdown = () => {
    const categories: Record<string, number> = {};
    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const category = transaction.category?.name || 'uncategorized';
        categories[category] = (categories[category] || 0) + Math.abs(transaction.amount);
      }
    });
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 8);
  };

  const categoryData = getCategoryBreakdown();
  const totalSpending = categoryData.reduce((sum, [, amount]) => sum + (amount as number), 0);

  return (
    <Card className="card-shadow border-0">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryData.map(([category, amount]) => {
          const amountNum = amount as number;
          const percentage = totalSpending > 0 ? (amountNum / totalSpending) * 100 : 0;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[category] || categoryColors.uncategorized }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {category}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  ${amountNum.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: categoryColors[category] || categoryColors.uncategorized
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {percentage.toFixed(1)}% of total spending
              </div>
            </div>
          );
        })}
        
        {categoryData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No spending data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}