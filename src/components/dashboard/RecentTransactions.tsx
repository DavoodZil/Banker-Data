
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors = {
  groceries: "bg-green-50 text-green-700 border-green-200",
  dining: "bg-yellow-50 text-yellow-700 border-yellow-200",
  transportation: "bg-blue-50 text-blue-700 border-blue-200",
  entertainment: "bg-purple-50 text-purple-700 border-purple-200",
  utilities: "bg-red-50 text-red-700 border-red-200",
  healthcare: "bg-cyan-50 text-cyan-700 border-cyan-200",
  shopping: "bg-pink-50 text-pink-700 border-pink-200",
  travel: "bg-lime-50 text-lime-700 border-lime-200",
  income: "bg-emerald-50 text-emerald-700 border-emerald-200",
  investments: "bg-indigo-50 text-indigo-700 border-indigo-200",
  uncategorized: "bg-gray-50 text-gray-700 border-gray-200"
};

export default function RecentTransactions({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader className="pb-4">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTransactions = transactions.slice(0, 25);

  return (
    <Card className="card-shadow border-0">
      <CardHeader className="pb-4">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-smooth"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2 rounded-full flex-shrink-0 ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">
                    {transaction.custom_description || transaction.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs mt-1 ${categoryColors[transaction.category] || categoryColors.uncategorized}`}
                >
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowUpRight className="w-6 h-6 text-gray-400" />
            </div>
            <p>No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
