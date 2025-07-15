import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getAuthToken } from "@/utils/auth";

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

export default function PaginatedTransactionTable({
  apiEndpoint = "42",
  accounts = [],
  pageSize = 50,
  onEditTransaction
}) {
  // Prepend the base URL if only endpoint number is provided
  const baseUrl = "https://staging.api.ocw.sebipay.com/api/v4/ag-grid/";
  const fullEndpoint = apiEndpoint.startsWith('http') ? apiEndpoint : `${baseUrl}${apiEndpoint}`;
  
  const [transactions, setTransactions] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-based
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        startRow: page * pageSize,
        endRow: (page + 1) * pageSize,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: []
      };
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(fullEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("Access denied. You don't have permission to view this data.");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      setTransactions(data.rowData || []);
      setRowCount(data.rowCount || 0);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
      setRowCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(rowCount / pageSize);

  return (
    <div>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <span className="text-red-600">Error: {error}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(pageSize).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="py-6 text-center text-gray-400">Loading...</TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                  No transactions found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => {
                const account = accounts.find(a => a.id === tx.account_id);
                const isPositive = tx.amountAmount > 0;
                return (
                  <TableRow key={tx.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {tx.date ? format(new Date(tx.date), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {tx.description_custom || tx.description || 'No description'}
                          </div>
                          {tx.merchant && (
                            <div className="text-sm text-gray-500">
                              {tx.merchant}
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
                        className={`${categoryColors[tx.category_id_custom] || categoryColors.uncategorized} text-xs`}
                      >
                        {tx.category_id_custom}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}${Math.abs(tx.amountAmount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{tx.base_type}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTransaction && onEditTransaction(tx)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-gray-700">
          Showing {rowCount === 0 ? 0 : page * pageSize + 1} to {Math.min((page + 1) * pageSize, rowCount)} of {rowCount} transactions
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm">Page {page + 1} of {totalPages || 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 