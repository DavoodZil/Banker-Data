/**
 * React Patterns Example
 * 
 * This file demonstrates the idiomatic React way to handle API calls
 * using custom hooks instead of class-based services.
 */

import React, { useState, useEffect } from 'react';
import { 
  useAccounts, 
  useTransactions, 
  useCategories,
  useApiCall,
  useMutation,
  useDebounce 
} from '@/hooks/api';

// ============================================================================
// 1. BASIC COMPONENT WITH HOOKS
// ============================================================================

function AccountListExample() {
  const { 
    accounts, 
    loading, 
    error, 
    fetchAccounts, 
    createAccount, 
    deleteAccount 
  } = useAccounts();

  // Fetch on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (formData) => {
    try {
      await createAccount(formData);
      // Success is handled in the hook with toast
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to create account:', error);
    }
  };

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Accounts ({accounts.length})</h2>
      {accounts.map(account => (
        <div key={account.id}>
          <span>{account.name} - ${account.balance}</span>
          <button onClick={() => deleteAccount(account.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 2. TRANSACTIONS WITH PAGINATION AND FILTERS
// ============================================================================

function TransactionListExample() {
  const {
    transactions,
    loading,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    categorizeTransaction,
  } = useTransactions();

  const { categories } = useCategories();

  // Filter handlers
  const handleDateFilter = (startDate, endDate) => {
    updateFilters({ start_date: startDate, end_date: endDate });
  };

  const handleCategoryFilter = (categoryId) => {
    updateFilters({ category_id: categoryId });
  };

  const handleCategorize = async (transactionId, categoryId) => {
    try {
      await categorizeTransaction(transactionId, categoryId);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div>
      {/* Filters */}
      <div>
        <select onChange={(e) => handleCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div>Loading transactions...</div>
      ) : (
        <>
          {transactions.map(transaction => (
            <div key={transaction.id}>
              <span>{transaction.description} - ${transaction.amount}</span>
              <select 
                value={transaction.category_id || ''} 
                onChange={(e) => handleCategorize(transaction.id, e.target.value)}
              >
                <option value="">Uncategorized</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          ))}
        </>
      )}

      {/* Pagination */}
      <div>
        <button onClick={prevPage} disabled={!hasPrevPage}>Previous</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>Next</button>
      </div>
    </div>
  );
}

// ============================================================================
// 3. SEARCH WITH DEBOUNCING
// ============================================================================

function TransactionSearchExample() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const { transactions, loading, updateFilters } = useTransactions();

  // Update filters when debounced value changes
  useEffect(() => {
    updateFilters({ q: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      
      {loading && searchInput && <div>Searching...</div>}
      
      <div>
        {transactions.map(transaction => (
          <div key={transaction.id}>
            {transaction.description} - ${transaction.amount}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. FORM WITH MUTATION
// ============================================================================

function CreateTransactionForm() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  const { createTransaction, loading } = useTransactions();
  const { categories } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      // Reset form on success
      setFormData({
        amount: '',
        description: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
      />
      
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      
      <select
        value={formData.category_id}
        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Transaction'}
      </button>
    </form>
  );
}

// ============================================================================
// 5. GENERIC API CALL EXAMPLE
// ============================================================================

function CustomApiCallExample() {
  const { data, loading, error, execute } = useApiCall();
  
  const fetchCustomData = async () => {
    // Use the generic hook for one-off API calls
    await execute(
      () => fetch('/api/custom-endpoint').then(res => res.json()),
      {
        successMessage: 'Data loaded successfully',
        showError: true,
      }
    );
  };

  return (
    <div>
      <button onClick={fetchCustomData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Custom Data'}
      </button>
      
      {error && <div>Error: {error}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ============================================================================
// 6. BULK OPERATIONS
// ============================================================================

function BulkCategorizeExample() {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { transactions, bulkCategorize, loading } = useTransactions();
  const { categories } = useCategories();

  const handleBulkCategorize = async () => {
    if (!selectedCategory || selectedTransactions.length === 0) return;
    
    try {
      await bulkCategorize(selectedTransactions, selectedCategory);
      setSelectedTransactions([]);
      setSelectedCategory('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const toggleTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <div>
        {transactions.map(transaction => (
          <div key={transaction.id}>
            <input
              type="checkbox"
              checked={selectedTransactions.includes(transaction.id)}
              onChange={() => toggleTransaction(transaction.id)}
            />
            <span>{transaction.description}</span>
          </div>
        ))}
      </div>
      
      <div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <button 
          onClick={handleBulkCategorize} 
          disabled={loading || !selectedCategory || selectedTransactions.length === 0}
        >
          Categorize {selectedTransactions.length} Transactions
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 7. REAL-TIME DATA WITH POLLING
// ============================================================================

function AccountBalanceMonitor({ accountId }) {
  const { account, loading, error, refetch } = useAccount(accountId);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      refetch();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [isPolling, refetch]);

  return (
    <div>
      <h3>{account?.name}</h3>
      <p>Balance: ${account?.balance || 0}</p>
      <p>Last Sync: {account?.last_sync || 'Never'}</p>
      
      <button onClick={() => setIsPolling(!isPolling)}>
        {isPolling ? 'Stop' : 'Start'} Auto-Refresh
      </button>
      
      <button onClick={refetch} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Now'}
      </button>
    </div>
  );
}

// ============================================================================
// 8. ERROR BOUNDARIES AND RETRY
// ============================================================================

function TransactionsWithRetry() {
  const [retryCount, setRetryCount] = useState(0);
  const { transactions, loading, error, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [retryCount]); // Re-fetch when retry count changes

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return (
      <div>
        <p>Failed to load transactions: {error}</p>
        <button onClick={handleRetry}>
          Retry (Attempt {retryCount + 1})
        </button>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {transactions.map(t => (
        <div key={t.id}>{t.description}</div>
      ))}
    </div>
  );
}

// ============================================================================
// KEY PATTERNS TO REMEMBER
// ============================================================================

/**
 * 1. **Custom Hooks Over Services**
 *    - Use custom hooks (useAccounts, useTransactions) instead of class-based services
 *    - Hooks manage state, loading, and errors internally
 * 
 * 2. **Effect Hook for Data Fetching**
 *    - Use useEffect to fetch data on mount
 *    - Include dependencies to re-fetch when needed
 * 
 * 3. **State Management**
 *    - Hooks return both data and actions
 *    - State updates trigger re-renders automatically
 * 
 * 4. **Error Handling**
 *    - Errors are handled within hooks
 *    - Use toast notifications for user feedback
 * 
 * 5. **Loading States**
 *    - Always show loading indicators
 *    - Disable buttons during operations
 * 
 * 6. **Optimistic Updates**
 *    - Update local state immediately
 *    - Revert on error (handled in hooks)
 * 
 * 7. **TypeScript Ready**
 *    - Types are defined in api.types.ts
 *    - Hooks will have proper typing when migrated to .ts
 * 
 * 8. **Composition**
 *    - Combine multiple hooks in components
 *    - Create specialized hooks by composing base hooks
 */

export {
  AccountListExample,
  TransactionListExample,
  TransactionSearchExample,
  CreateTransactionForm,
  CustomApiCallExample,
  BulkCategorizeExample,
  AccountBalanceMonitor,
  TransactionsWithRetry,
};