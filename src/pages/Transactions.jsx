
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransactions } from "@/hooks/api";
import { useDebounceWithLoading } from "@/hooks/api/useDebounce";
import { useBankData } from "@/hooks/useBankData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Calendar, ArrowUpDown, RefreshCw, Upload, Loader2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";
// TODO: Implement these functions in the new API structure
// import { syncTransactions } from "@/api/functions";
// import { fetchFromNgrok } from "@/api/functions";
// import { triggerWebhookSync } from "@/api/functions";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import TransactionEditModal from "../components/transactions/TransactionEditModal";
import TransactionTotalsCards from "../components/transactions/TransactionTotalsCards";

export default function Transactions() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { debouncedValue: debouncedSearchQuery, isDebouncing } = useDebounceWithLoading(searchQuery, 500); // 500ms delay for search
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const transactionListRef = useRef(null);
  const [filters, setFilters] = useState({
    account: 'all',
    category: 'all',
    dateRange: 'all', // Changed default from 'this_month' to 'all'
    amountRange: 'all'
  });
  
  // Convert filter values to payload format with separate filter fields
  const filterPayload = useMemo(() => {
    const payload = {
      filterModel: {}, // Keep filterModel empty as per virtual card platform
      filteredDescription: debouncedSearchQuery || '',
      filteredBankAccounts: filters.account !== 'all' ? [filters.account] : "",
      filteredCategory: filters.category !== 'all' ? filters.category : '',
      categoriesList: '', // Will be populated if needed
      filteredDate: '',
      fromDate: '2015-07-29', // Default wide date range
      toDate: '2035-07-29'
    };
    
    // Handle date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let dateFrom, dateTo;
      
      switch (filters.dateRange) {
        case 'this_month':
          dateFrom = startOfMonth(now);
          dateTo = endOfMonth(now);
          break;
        case 'last_month':
          const lastMonth = subMonths(now, 1);
          dateFrom = startOfMonth(lastMonth);
          dateTo = endOfMonth(lastMonth);
          break;
        case 'last_3_months':
          dateFrom = startOfDay(subMonths(now, 3));
          dateTo = endOfDay(now);
          break;
        case 'last_6_months':
          dateFrom = startOfDay(subMonths(now, 6));
          dateTo = endOfDay(now);
          break;
      }
      
      if (dateFrom && dateTo) {
        payload.fromDate = format(dateFrom, 'yyyy-MM-dd');
        payload.toDate = format(dateTo, 'yyyy-MM-dd');
        payload.filteredDate = filters.dateRange; // Store the filter type
      }
    }
    
    // Handle amount range filter
    if (filters.amountRange !== 'all') {
      switch (filters.amountRange) {
        case 'under_50':
          payload.minimumAmount = '0';
          payload.maximumAmount = '49.99';
          break;
        case '50_to_200':
          payload.minimumAmount = '50.00';
          payload.maximumAmount = '200.00';
          break;
        case 'over_200':
          payload.minimumAmount = '200.01';
          payload.maximumAmount = '999999.99'; // Large number for "over" range
          break;
      }
    }
    
    return payload;
  }, [debouncedSearchQuery, filters]);
  const [syncMethod, setSyncMethod] = useState('direct'); // 'direct' or 'ngrok'

  // Use the new hooks - don't pass initial filters, will be set via updateFilters
  const { 
    transactions, 
    loading: isLoading, 
    error, 
    refetch: refetchTransactions, 
    updateTransaction, 
    updateFilters,
    pagination 
  } = useTransactions();
  const { bankData, isLoading: bankDataLoading, error: bankDataError, refetch: refetchBankData } = useBankData();

  // Extract accounts from bankData structure
  const accounts = bankData?.data?.accounts ? Object.values(bankData.data.accounts) : [];

  useEffect(() => {
    // Data is automatically loaded by the useBankData hook
    setLastSync(new Date());
  }, []);

  const loadData = async () => {
    await Promise.all([
      refetchTransactions(),
      refetchBankData()
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
        console.error("Webhook trigger failed:", response.data?.error || "Unknown error");
        alert(`Webhook trigger failed: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error('Failed to trigger webhook sync:', error);
      alert(`Failed to trigger webhook sync: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransaction = async (transactionId, updates) => {
    const payload = {
      transactionId: transactionId,
      categoryId: updates.category,
      description: updates.description,  
      merchantName: updates.merchantName,
    }
    await updateTransaction(payload);
    
    // Refresh the transaction table directly
    if (transactionListRef.current?.refresh) {
      transactionListRef.current.refresh();
    }
    
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

  // Update filters when they change
  useEffect(() => {
    updateFilters(filterPayload);
  }, [filterPayload, updateFilters]);
  
  // Transactions are filtered by the API
  const filteredTransactions = transactions;

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

      <TransactionTotalsCards filters={filterPayload} />

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
                  className="pl-10 pr-10"
                />
                {isDebouncing && (
                  <Loader2 className="w-4 h-4 absolute right-3 top-3 text-gray-400 animate-spin" />
                )}
              </div>
            </div>
            <TransactionFilters
              filters={filters}
              onFiltersChange={setFilters}
              accounts={accounts}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 ">
          <TransactionList
            ref={transactionListRef}
            transactions={filteredTransactions}
            accounts={accounts}
            isLoading={false}
            onEditTransaction={setSelectedTransaction}
            filters={filterPayload}
          />
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
