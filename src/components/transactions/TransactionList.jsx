import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

export default function TransactionList({ transactions, accounts, isLoading, onEditTransaction }) {
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No transactions found matching your criteria
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const account = accounts.find(a => a.id === transaction.account_id);
            
            return (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.custom_description || transaction.description}
                      </div>
                      {transaction.merchant && (
                        <div className="text-sm text-gray-500">
                          {transaction.merchant}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {account?.account_name || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {account?.institution_name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${categoryColors[transaction.category] || categoryColors.uncategorized} text-xs`}
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTransaction(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}