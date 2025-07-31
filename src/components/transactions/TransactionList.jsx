import React, { forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaginatedTransactionTable from "./PaginatedTransactionTable";



const TransactionList = forwardRef(function TransactionList({ transactions, accounts, isLoading, onEditTransaction, filters }, ref) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use PaginatedTransactionTable for server-side pagination
  return (
    <PaginatedTransactionTable
      ref={ref}
      accounts={accounts}
      onEditTransaction={onEditTransaction}
      filters={filters}
    />
  );
});

export default TransactionList;