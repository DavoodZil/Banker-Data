
import React, { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/api";
import { useAccounts } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Calendar, ArrowUpDown, RefreshCw, Upload } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
// TODO: Implement these functions in the new API structure
// import { syncTransactions } from "@/api/functions";
// import { fetchFromNgrok } from "@/api/functions";
// import { triggerWebhookSync } from "@/api/functions";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import TransactionEditModal from "../components/transactions/TransactionEditModal";

export default function Transactions() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    account: 'all',
    category: 'all',
    dateRange: 'all', // Changed default from 'this_month' to 'all'
    amountRange: 'all'
  });
  const [syncMethod, setSyncMethod] = useState('direct'); // 'direct' or 'ngrok'

  // Use the new hooks
  const { transactions, loading, error, fetchTransactions, updateTransaction } = useTransactions();
  const { accounts, fetchAccounts } = useAccounts();
  
  // Mock the missing properties for compatibility
  const isLoading = loading;
  const refetch = fetchTransactions;
  const refetchAccounts = fetchAccounts;
  
  // Mock functions for missing API calls
  const fetchFromNgrok = async () => {
    console.log('Ngrok sync not implemented yet');
    return { data: { success: false, message: 'Ngrok sync not implemented' } };
  };
  
  const syncTransactions = async () => {
    console.log('Direct sync not implemented yet');
    return { data: { success: false, message: 'Direct sync not implemented' } };
  };
  
  const triggerWebhookSync = async () => {
    console.log('Webhook sync not implemented yet');
    return { data: { success: false, message: 'Webhook sync not implemented' } };
  };

  useEffect(() => {
    // Data is automatically loaded by the hooks
    setLastSync(new Date());
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchTransactions(),
      fetchAccounts()
    ]);
    setLastSync(new Date());
  };

  const handleSyncTransactions = async () => {
    setIsSyncing(true);
    try {
      let response;
      
      if (syncMethod === 'ngrok') {
        response = await fetchFromNgrok();
        if (response.data && response.data.success) {
          console.log(response.data.message || "Transactions synced successfully via Ngrok!");
          await loadData();
        } else {
          const errorDetails = response.data;
          console.error("Ngrok Sync failed:", errorDetails);
          const alertMessage = 
            `Ngrok Sync Failed: ${errorDetails?.message || 'Unknown error'}\n\n` +
            `Details: ${errorDetails?.error || 'N/A'}\n` +
            `URL Used: ${errorDetails?.ngrok_url || 'N/A'}\n\n` +
            `Suggestion: ${errorDetails?.suggestion || 'Please check your local server and ngrok tunnel, and ensure the NGROK_URL secret is up to date.'}`;
          alert(alertMessage);
        }
      } else { // Direct sync
        response = await syncTransactions();
        if (response.data && response.data.success) {
            console.log(response.data.message || "Transactions synced successfully!");
            await loadData();
        } else {
            console.error("Sync failed:", response.data?.error || response.data?.details || "Unknown error");
            alert(`Sync failed: ${response.data?.message || response.data?.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error('Failed to sync transactions:', error);
      
      // Handle rate limit errors specifically
      if (error.response?.status === 429) {
        alert('Rate limit exceeded. Please wait 2-3 minutes before trying to sync again.');
      } else {
        alert(`An unexpected error occurred during sync: ${error.message}`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleWebhookTrigger = async () => {
    setIsSyncing(true);
    try {
      const response = await triggerWebhookSync();
      if (response.data && response.data.success) {
        console.log("Webhook sync triggered successfully!");
        // Wait a moment for webhook processing, then reload
        setTimeout(async () => {
          await loadData();
        }, 2000);
      } else {
        console.error("Webhook trigger failed:", (response.data as any)?.error || "Unknown error");
        alert(`Webhook trigger failed: ${(response.data as any)?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error('Failed to trigger webhook sync:', error);
      alert(`Failed to trigger webhook sync: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransaction = async (transactionId, updates) => {
    await updateTransaction(transactionId, updates);
    loadData();
    setSelectedTransaction(null);
  };

  const exportTransactions = () => {
    const csvData = filteredTransactions.map(t => {
      const account = accounts.find(a => a.id === t.account_id);
      return {
        Date: format(new Date(t.date), 'yyyy-MM-dd'),
        Description: t.custom_description || t.description,
        Amount: t.amount,
        Category: t.category,
        Account: account?.account_name || 'Unknown',
        Merchant: t.merchant || ''
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchQuery || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.custom_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAccount = filters.account === 'all' || transaction.account_id === filters.account;

    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;

    let matchesDate = true;
    if (filters.dateRange !== 'all') { // Only apply date filtering if dateRange is not 'all'
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'this_month':
          matchesDate = transactionDate >= startOfMonth(now) && transactionDate <= endOfMonth(now);
          break;
        case 'last_month':
          const lastMonth = subMonths(now, 1);
          matchesDate = transactionDate >= startOfMonth(lastMonth) && transactionDate <= endOfMonth(lastMonth);
          break;
        case 'last_3_months':
          matchesDate = transactionDate >= subMonths(now, 3);
          break;
        case 'last_6_months':
          matchesDate = transactionDate >= subMonths(now, 6);
          break;
      }
    }

    let matchesAmount = true;
    switch (filters.amountRange) {
      case 'under_50':
        matchesAmount = Math.abs(transaction.amount) < 50;
        break;
      case '50_to_200':
        matchesAmount = Math.abs(transaction.amount) >= 50 && Math.abs(transaction.amount) <= 200;
        break;
      case 'over_200':
        matchesAmount = Math.abs(transaction.amount) > 200;
        break;
    }

    return matchesSearch && matchesAccount && matchesCategory && matchesDate && matchesAmount;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalSpent = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">
            Review and categorize your financial transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-sm text-gray-500">
            Last sync: {format(lastSync, 'MMM d, h:mm a')}
          </div>
          
          <Select value={syncMethod} onValueChange={setSyncMethod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct Sync</SelectItem>
              <SelectItem value="ngrok">Via Ngrok</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleSyncTransactions}
            disabled={isSyncing || isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : (syncMethod === 'ngrok' ? 'Sync via Ngrok' : 'Sync')}
          </Button>
          
          {/* <Button
            variant="outline"
            onClick={handleWebhookTrigger}
            disabled={isSyncing || isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Trigger Webhook
          </Button> */}
          
          <Button
            variant="outline"
            onClick={exportTransactions}
            disabled={filteredTransactions.length === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>

          <Link to={createPageUrl('Import')}>
            <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {filteredTransactions.length}
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
              +${totalIncome.toLocaleString()}
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
              -${totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-0">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <TransactionFilters
              filters={filters}
              onFiltersChange={setFilters}
              accounts={accounts}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionList
            transactions={paginatedTransactions}
            accounts={accounts}
            isLoading={isLoading}
            onEditTransaction={setSelectedTransaction}
          />
          
          {/* Pagination Controls */}
          {filteredTransactions.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-10 h-8"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionEditModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onSave={handleUpdateTransaction}
      />
    </div>
  );
}
