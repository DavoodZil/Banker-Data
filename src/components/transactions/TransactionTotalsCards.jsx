import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionTotals } from '@/hooks/api/useTransactionTotals';

export default function TransactionTotalsCards({ filters }) {
  const { totals, loading, error } = useTransactionTotals(filters);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="card-shadow border-0">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600">Failed to load totals</div>
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

  const totalAmount = parseNumber(totals.total);
  const count = parseNumber(totals.count);
  const credit = parseNumber(totals.credit);
  const debit = parseNumber(totals.debit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="card-shadow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {count.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            +${credit.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            -${debit.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Net Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalAmount >= 0 ? '+' : ''}${totalAmount.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}