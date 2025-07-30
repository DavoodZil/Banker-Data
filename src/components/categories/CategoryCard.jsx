import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoryCard({ category, stats, onEdit, compact = false }) {
  const hasSpending = stats.totalSpent > 0;
  const budgetPercentage = category.budget_amount ? (stats.totalSpent / category.budget_amount) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;

  const formatCategoryName = (name) => {
    return name ? name.replace(/_/g, ' ').replace(/&nbsp;/g, ' ').trim() : name;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-emerald-200 h-full bg-white">
      <CardContent className="p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-lg shrink-0"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              {category.icon || category.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 capitalize leading-tight truncate">
                {formatCategoryName(category.name)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  {stats.transactionCount} transaction{stats.transactionCount !== 1 ? 's' : ''}
                </span>
                {hasSpending && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amount Section */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${stats.totalSpent.toLocaleString()}
          </div>
          {stats.averageAmount > 0 && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              ${stats.averageAmount.toFixed(0)} avg per transaction
            </div>
          )}
        </div>

        {/* Budget Progress - Only show if budget is set */}
        {category.budget_amount && (
          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget Progress</span>
              <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
                ${category.budget_amount.toLocaleString()}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, budgetPercentage)}%`
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                  {budgetPercentage.toFixed(0)}% used
                </span>
                {isOverBudget ? (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="font-medium">Over budget!</span>
                  </div>
                ) : (
                  <span className="text-gray-500">
                    ${(category.budget_amount - stats.totalSpent).toLocaleString()} left
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Budget/No Spending State */}
        {!category.budget_amount && !hasSpending && (
          <div className="text-sm text-gray-400 italic flex items-center gap-1 mt-auto">
            <Calendar className="w-3 h-3" />
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}