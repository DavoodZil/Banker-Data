import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { accountApi } from '@/api/client';

/**
 * Example Custom Hook: useAccountData
 * 
 * This demonstrates React custom hook patterns and best practices:
 * - State management with useState
 * - Side effects with useEffect
 * - Performance optimization with useMemo and useCallback
 * - Error handling and loading states
 * - API integration
 * - Cleanup and memory management
 * - TypeScript integration
 * 
 * Angular Comparison:
 * - React: Custom hook with state and effects
 * - Angular: Injectable service with BehaviorSubject/Observable
 * - React: useState for reactive state
 * - Angular: BehaviorSubject for reactive state
 * - React: useEffect for side effects
 * - Angular: Constructor or ngOnInit for initialization
 */

interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit';
  status: 'active' | 'inactive';
  lastSync?: string;
}

interface UseAccountDataOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: Account[]) => void;
}

interface UseAccountDataReturn {
  // State
  accounts: Account[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  
  // Actions
  fetchAccounts: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Computed values
  totalBalance: number;
  activeAccounts: Account[];
  accountsByType: Record<string, Account[]>;
  
  // Utilities
  getAccountById: (id: string) => Account | undefined;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Custom hook for managing account data
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing state, actions, and computed values
 */
export const useAccountData = (options: UseAccountDataOptions = {}): UseAccountDataReturn => {
  const {
    autoFetch = true,
    refreshInterval = 300000, // 5 minutes
    onError,
    onSuccess
  } = options;

  // State management - equivalent to Angular service properties
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Refs for cleanup and tracking
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Computed values with useMemo - equivalent to Angular getters
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }, [accounts]);

  const activeAccounts = useMemo(() => {
    return accounts.filter(account => account.status === 'active');
  }, [accounts]);

  const accountsByType = useMemo(() => {
    return accounts.reduce((acc, account) => {
      const type = account.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    }, {} as Record<string, Account[]>);
  }, [accounts]);

  // Utility functions with useCallback - equivalent to Angular service methods
  const getAccountById = useCallback((id: string): Account | undefined => {
    return accounts.find(account => account.id === id);
  }, [accounts]);

  // API functions with useCallback for stability
  const fetchAccounts = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await accountApi.list();
      
      // Transform API response to our interface
      const transformedAccounts: Account[] = response.data.map((account: any) => ({
        id: account.id,
        name: account.name || account.nick_name,
        balance: parseFloat(account.current_balance?.toString() || '0'),
        type: account.account_type || 'checking',
        status: account.status === '1' || account.status === 1 ? 'active' : 'inactive',
        lastSync: account.last_updated
      }));

      setAccounts(transformedAccounts);
      setLastFetched(new Date());
      
      // Call success callback if provided
      onSuccess?.(transformedAccounts);
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch accounts';
      setError(errorMessage);
      
      // Call error callback if provided
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = useCallback(async (accountData: Omit<Account, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountApi.create({
        name: accountData.name,
        account_type: accountData.type,
        current_balance: accountData.balance.toString(),
        status: accountData.status === 'active' ? '1' : '0'
      });

      const newAccount: Account = {
        id: response.data.id,
        name: response.data.name,
        balance: parseFloat(response.data.current_balance?.toString() || '0'),
        type: response.data.account_type || 'checking',
        status: response.data.status === '1' ? 'active' : 'inactive',
        lastSync: response.data.last_updated
      };

      setAccounts(prev => [...prev, newAccount]);
      setLastFetched(new Date());
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add account';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const updateAccount = useCallback(async (id: string, updates: Partial<Account>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountApi.patch(id, {
        name: updates.name,
        account_type: updates.type,
        current_balance: updates.balance?.toString(),
        status: updates.status === 'active' ? '1' : '0'
      });

      setAccounts(prev => prev.map(account => 
        account.id === id 
          ? { 
              ...account, 
              ...updates,
              balance: parseFloat(response.data.current_balance?.toString() || '0'),
              status: response.data.status === '1' ? 'active' : 'inactive'
            }
          : account
      ));
      setLastFetched(new Date());
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update account';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await accountApi.delete(id);
      
      setAccounts(prev => prev.filter(account => account.id !== id));
      setLastFetched(new Date());
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete account';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Side effects with useEffect - equivalent to Angular lifecycle hooks
  useEffect(() => {
    // Initial data fetch (componentDidMount equivalent)
    if (autoFetch) {
      fetchAccounts();
    }

    // Cleanup function (componentWillUnmount equivalent)
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoFetch, fetchAccounts]);

  // Auto-refresh effect
  useEffect(() => {
    if (refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchAccounts();
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [refreshInterval, fetchAccounts]);

  // Return hook interface
  return {
    // State
    accounts,
    loading,
    error,
    lastFetched,
    
    // Actions
    fetchAccounts,
    refreshAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    
    // Computed values
    totalBalance,
    activeAccounts,
    accountsByType,
    
    // Utilities
    getAccountById,
    isLoading: loading,
    hasError: error !== null
  };
};

/**
 * Example usage of the custom hook:
 * 
 * ```tsx
 * function AccountList() {
 *   const {
 *     accounts,
 *     loading,
 *     error,
 *     totalBalance,
 *     fetchAccounts,
 *     addAccount
 *   } = useAccountData({
 *     autoFetch: true,
 *     refreshInterval: 60000, // 1 minute
 *     onError: (error) => console.error('Account error:', error),
 *     onSuccess: (data) => console.log('Accounts loaded:', data)
 *   });
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       <h2>Total Balance: ${totalBalance}</h2>
 *       {accounts.map(account => (
 *         <div key={account.id}>{account.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Angular Equivalent Service:
 * 
 * ```typescript
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class AccountService {
 *   private accountsSubject = new BehaviorSubject<Account[]>([]);
 *   accounts$ = this.accountsSubject.asObservable();
 *   
 *   private loadingSubject = new BehaviorSubject<boolean>(false);
 *   loading$ = this.loadingSubject.asObservable();
 *   
 *   private errorSubject = new BehaviorSubject<string | null>(null);
 *   error$ = this.errorSubject.asObservable();
 *   
 *   get totalBalance$() {
 *     return this.accounts$.pipe(
 *       map(accounts => accounts.reduce((sum, acc) => sum + acc.balance, 0))
 *     );
 *   }
 *   
 *   get activeAccounts$() {
 *     return this.accounts$.pipe(
 *       map(accounts => accounts.filter(acc => acc.status === 'active'))
 *     );
 *   }
 *   
 *   async fetchAccounts(): Promise<void> {
 *     this.loadingSubject.next(true);
 *     this.errorSubject.next(null);
 *     
 *     try {
 *       const response = await this.http.get<Account[]>('/api/accounts').toPromise();
 *       this.accountsSubject.next(response);
 *     } catch (error) {
 *       this.errorSubject.next(error.message);
 *     } finally {
 *       this.loadingSubject.next(false);
 *     }
 *   }
 *   
 *   async addAccount(account: Omit<Account, 'id'>): Promise<void> {
 *     try {
 *       const response = await this.http.post<Account>('/api/accounts', account).toPromise();
 *       const currentAccounts = this.accountsSubject.value;
 *       this.accountsSubject.next([...currentAccounts, response]);
 *     } catch (error) {
 *       this.errorSubject.next(error.message);
 *     }
 *   }
 * }
 * 
 * // Usage in component
 * @Component({
 *   selector: 'app-account-list',
 *   template: `
 *     <div *ngIf="loading$ | async">Loading...</div>
 *     <div *ngIf="error$ | async as error">Error: {{error}}</div>
 *     <div *ngFor="let account of accounts$ | async">
 *       {{account.name}}
 *     </div>
 *   `
 * })
 * export class AccountListComponent implements OnInit {
 *   accounts$ = this.accountService.accounts$;
 *   loading$ = this.accountService.loading$;
 *   error$ = this.accountService.error$;
 *   totalBalance$ = this.accountService.totalBalance$;
 *   
 *   constructor(private accountService: AccountService) {}
 *   
 *   ngOnInit() {
 *     this.accountService.fetchAccounts();
 *   }
 * }
 * ```
 */ 