
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useCategories } from "@/hooks/api";

export default function TransactionFilters({ filters, onFiltersChange, accounts }) {
  const { childCategories, loading: categoriesLoading } = useCategories();
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      account: 'all',
      category: 'all',
      dateRange: 'all', // Changed from 'this_month' to 'all'
      amountRange: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all'); // Updated condition

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.account} onValueChange={(value) => handleFilterChange('account', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Accounts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Accounts</SelectItem>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name || account.account_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categoriesLoading ? (
            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
          ) : (
            childCategories.map((category) => (
              <SelectItem key={category.enc_id} value={category.enc_id}>
                {category.parent_name} - {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem> {/* Moved 'All Time' to the top */}
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="last_month">Last Month</SelectItem>
          <SelectItem value="last_3_months">Last 3 Months</SelectItem>
          <SelectItem value="last_6_months">Last 6 Months</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.amountRange} onValueChange={(value) => handleFilterChange('amountRange', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Amount Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Amounts</SelectItem>
          <SelectItem value="under_50">Under $50</SelectItem>
          <SelectItem value="50_to_200">$50 - $200</SelectItem>
          <SelectItem value="over_200">Over $200</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1">
          <X className="w-3 h-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
