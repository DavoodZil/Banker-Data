# React Hooks API Documentation

## Overview
This directory contains React hooks for API operations. These hooks follow React best practices and replace the old Angular-style service classes.

## Available Hooks

### Core Resource Hooks
- `useAccounts()` - Account management
- `useTransactions()` - Transaction operations with pagination
- `useCategories()` - Category management
- `useRules()` - Rule operations (TODO: implement)
- `useTags()` - Tag management (TODO: implement)
- `useEntities()` - Entity operations (TODO: implement)
- `useMerchants()` - Merchant management (TODO: implement)

### Utility Hooks
- `useApiCall()` - Generic hook for one-off API calls
- `useMutation()` - For create/update/delete operations
- `useDebounce()` - Debouncing utility for search inputs
- `usePagination()` - Pagination state management (TODO: implement)

## Usage Example

```javascript
import { useAccounts } from '@/hooks/api';

function MyComponent() {
  const { 
    accounts,      // Account data
    loading,       // Loading state
    error,         // Error message
    fetchAccounts, // Refetch function
    createAccount, // Create new account
    updateAccount, // Update existing account
    deleteAccount  // Delete account
  } = useAccounts();

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {accounts.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
}
```

## TypeScript Support
Type definitions are available in `/src/types/api.types.ts`. When migrating to TypeScript, all hooks will have full type support.

## Migration from Old Pattern
If your component still uses the old pattern:
```javascript
// Old (deprecated)
import { Account } from '@/api/entities';
const accounts = await Account.list();

// New (recommended)
import { useAccounts } from '@/hooks/api';
const { accounts } = useAccounts();

// New (recommended)
import { useAccounts } from '@/hooks/api';
const { accounts, fetchAccounts } = useAccounts();
```

## Best Practices
1. Always handle loading states
2. Show user-friendly error messages
3. Use `useEffect` for data fetching on mount
4. Leverage built-in toast notifications
5. Compose hooks for complex features

## Examples
See `REACT_PATTERNS_EXAMPLE.jsx` for comprehensive usage examples.