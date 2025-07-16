/**
 * API Type Definitions
 * 
 * TypeScript types for API responses and requests.
 * Ready for when you migrate from .js to .ts files.
 */

// Base types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Account types
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'other';
  institution: string;
  account_number?: string;
  routing_number?: string;
  balance: number;
  currency: string;
  is_active: boolean;
  is_manual: boolean;
  plaid_account_id?: string;
  plaid_item_id?: string;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountInput {
  name: string;
  type: Account['type'];
  institution: string;
  account_number?: string;
  routing_number?: string;
  balance?: number;
  currency?: string;
  is_manual?: boolean;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {
  balance?: number;
  is_active?: boolean;
}

// Transaction types
export interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  description: string;
  merchant_name?: string;
  category_id?: string;
  date: string;
  pending: boolean;
  transaction_type: 'debit' | 'credit';
  tags?: Tag[];
  notes?: string;
  is_duplicate?: boolean;
  duplicate_of?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionInput {
  account_id: string;
  amount: number;
  description: string;
  merchant_name?: string;
  category_id?: string;
  date: string;
  transaction_type: Transaction['transaction_type'];
  notes?: string;
}

export interface TransactionFilters {
  account_id?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  transaction_type?: Transaction['transaction_type'];
  q?: string; // Search query
}

// Category types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  parent_id?: string;
  parent?: string;
  color?: string;
  icon?: string;
  budget_amount?: number;
  is_hidden?: boolean;
  yd_category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  parent?: string;
  type?: Category['type'];
  color?: string;
  icon?: string;
  budget_amount?: number;
}

export interface CategoryWithStats extends Category {
  transaction_count: number;
  total_amount: number;
  average_amount: number;
}

// Rule types
export interface Rule {
  id: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RuleCondition {
  field: 'description' | 'merchant_name' | 'amount';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface RuleAction {
  type: 'categorize' | 'tag' | 'flag';
  value: string; // category_id, tag_id, or flag name
}

// Tag types
export interface Tag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

// Entity types
export interface Entity {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'organization';
  tax_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Merchant types
export interface Merchant {
  id: string;
  name: string;
  display_name?: string;
  default_category_id?: string;
  logo_url?: string;
  website?: string;
  transaction_count?: number;
  total_spent?: number;
  created_at: string;
  updated_at: string;
}

// Plaid types
export interface PlaidLinkToken {
  link_token: string;
  expiration: string;
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  official_name?: string;
  type: string;
  subtype: string;
  mask: string;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
  };
}

// File upload types
export interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  mime_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// Hook return types
export interface UseApiCallReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (apiFunction: () => Promise<any>, options?: any) => Promise<T | null>;
  reset: () => void;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

// Extended Account types for actual API responses
export interface AccountResponse {
  id: string;
  name: string;
  nick_name?: string;
  type: string;
  institution: string;
  account_number?: string;
  routing_number?: string;
  current_balance: number;
  available_balance_amount?: number;
  currency: string;
  is_active: boolean;
  is_manual: boolean;
  plaid_account_id?: string;
  plaid_item_id?: string;
  company_id?: string;
  last_sync?: string;
  last_updated?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

// Transaction with extended fields
export interface TransactionResponse {
  id: string;
  account_id: string;
  amount: number;
  description: string;
  merchant_name?: string;
  category_id?: string;
  category?: Category;
  date: string;
  pending: boolean;
  transaction_type: 'debit' | 'credit';
  tags?: Tag[];
  notes?: string;
  is_duplicate?: boolean;
  duplicate_of?: string;
  created_at: string;
  updated_at: string;
}

// Category with extended fields
export interface CategoryResponse {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  parent_id?: string;
  parent?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  budget_amount?: number;
  is_hidden?: boolean;
  yd_category_id?: string;
  subcategories?: CategoryResponse[];
  created_at: string;
  updated_at: string;
}

// Hook return types for API operations
export interface UseAccountsReturn {
  accounts: AccountResponse[];
  loading: boolean;
  error: any;
  fetchAccounts: (params?: any) => Promise<any>;
  getAccount: (id: string) => Promise<any>;
  createAccount: (data: any) => Promise<any>;
  updateAccount: (id: string, data: any) => Promise<any>;
  deleteAccount: (id: string) => Promise<any>;
  connectPlaidAccount: (token: string, accountIds: string[]) => Promise<any>;
  syncAccount: (id: string) => Promise<any>;
  getAccountTransactions: (id: string, options?: any) => Promise<any>;
  accountCount: number;
}

export interface UseTransactionsReturn {
  transactions: TransactionResponse[];
  loading: boolean;
  error: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: any;
  fetchTransactions: (options?: any) => Promise<{ data: any; meta: any; }>;
  getTransaction: (id: string) => Promise<any>;
  createTransaction: (data: any) => Promise<any>;
  updateTransaction: (id: string, data: any) => Promise<any>;
  deleteTransaction: (id: string) => Promise<any>;
  bulkUpdateTransactions: (ids: string[], data: any) => Promise<any>;
  bulkDeleteTransactions: (ids: string[]) => Promise<any>;
  splitTransaction: (id: string, splits: any[]) => Promise<any>;
  duplicateTransaction: (id: string, data: any) => Promise<any>;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UseCategoriesReturn {
  categories: CategoryResponse[];
  loading: boolean;
  error: any;
  fetchCategories: () => Promise<{ categories: any; yd_categories: any; }>;
  createCategory: (data: any) => Promise<any>;
  updateCategory: (id: string, data: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;
  getCategory: (id: string) => Promise<any>;
  getCategoryTransactions: (id: string, options?: any) => Promise<any>;
  getCategoriesByType: (type: string) => CategoryResponse[];
  getCategoryStats: (id: string) => Promise<any>;
  searchCategories: (query: string) => CategoryResponse[];
}

// Entity types
export interface TagEntity {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface UseTagsReturn {
  tags: TagEntity[];
  loading: boolean;
  error: any;
  fetchTags: () => Promise<any>;
  createTag: (data: any) => Promise<any>;
  updateTag: (id: string, data: any) => Promise<any>;
  deleteTag: (id: string) => Promise<any>;
  getTag: (id: string) => Promise<any>;
  searchTags: (query: string) => TagEntity[];
}

// Component props
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface FilterToggleProps {
  label: string;
  icon: any;
  isEnabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}