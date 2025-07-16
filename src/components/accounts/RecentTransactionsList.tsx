import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const categoryColors = {
  groceries: "bg-green-100 text-green-800",
  dining: "bg-yellow-100 text-yellow-800",
  transportation: "bg-blue-100 text-blue-800",
  entertainment: "bg-purple-100 text-purple-800",
  utilities: "bg-red-100 text-red-800",
  healthcare: "bg-cyan-100 text-cyan-800",
  shopping: "bg-pink-100 text-pink-800",
  travel: "bg-lime-100 text-lime-800",
  income: "bg-emerald-100 text-emerald-800",
  investments: "bg-indigo-100 text-indigo-800",
  uncategorized: "bg-gray-100 text-gray-800"
};

export default function RecentTransactionsList({ transactions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-medium">{tx.custom_description || tx.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${categoryColors[tx.category] || categoryColors.uncategorized}`}>
                      {tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent transactions for this account.</p>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}