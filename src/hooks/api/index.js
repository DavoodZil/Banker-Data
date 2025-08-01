/**
 * API Hooks Index
 * 
 * Central export point for all API hooks.
 * These hooks follow React best practices for data fetching.
 */

// Account hooks
export { useAccounts, useAccount } from './useAccounts';

// Transaction hooks
export { 
  useTransactions, 
  useTransactionSearch, 
  useTransactionStats 
} from './useTransactions';
export { useTransactionTotals } from './useTransactionTotals';

// Category hooks
export { 
  useCategories, 
  useCategorySearch, 
  useCategoryBudget 
} from './useCategories';

// Rule hooks
export { useRules, useRule, useRuleTest } from './useRules';

// Tag hooks
export { useTags, useTagSuggestions } from './useTags';

// Goal hooks
export { useGoals } from './useGoals';

// Entity hooks
export { useEntities, useEntity } from './useEntities';

// Merchant hooks
export { useMerchants, useMerchantSearch } from './useMerchants';

// Plaid hooks
export { usePlaidLink, usePlaidAccounts } from './usePlaid';

// File hooks
export { useFileUpload, useFileImport } from './useFiles';

// Access Token hooks
export { useAccessTokens } from './useAccessTokens';

// Common hooks
export { useApiCall } from './useApiCall';
export { usePagination } from './usePagination';
export { useDebounce } from './useDebounce';