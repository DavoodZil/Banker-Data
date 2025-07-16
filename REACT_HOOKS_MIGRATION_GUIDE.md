# React Hooks Migration Guide

## Overview
This guide explains the proper React way to handle API calls using custom hooks instead of Angular-style services.

## Why Hooks Instead of Services?

### Angular Pattern (Not React)
```javascript
// ❌ Class-based service (Angular style)
class AccountService {
  async getAccounts() { }
  async createAccount() { }
}

// Component
const service = new AccountService();
const accounts = await service.getAccounts();
```

### React Pattern (Correct)
```javascript
// ✅ Custom hook (React style)
function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAccounts = async () => {
    setLoading(true);
    const data = await accountApi.list();
    setAccounts(data);
    setLoading(false);
  };
  
  return { accounts, loading, fetchAccounts };
}

// Component
const { accounts, loading, fetchAccounts } = useAccounts();
```

## File Structure

```
/src
├── api/
│   └── client.js         # Simple API functions (not classes)
├── hooks/
│   └── api/
│       ├── useAccounts.js
│       ├── useTransactions.js
│       ├── useCategories.js
│       └── index.js
└── types/
    └── api.types.ts      # TypeScript types (for future)
```

## Migration Steps

### 1. Update Component Imports

```javascript
// Before (Angular style)
import { accountService } from '@/services';

// After (React style)
import { useAccounts } from '@/hooks/api';
```

### 2. Replace Service Calls with Hooks

```javascript
// Before
class AccountList extends Component {
  async componentDidMount() {
    const accounts = await accountService.list();
    this.setState({ accounts });
  }
}

// After
function AccountList() {
  const { accounts, loading, fetchAccounts } = useAccounts();
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{/* render accounts */}</div>;
}
```

### 3. Handle Loading and Errors

```javascript
function MyComponent() {
  const { 
    accounts,      // Data
    loading,       // Loading state
    error,         // Error message
    fetchAccounts, // Refetch function
    createAccount, // Create function
    updateAccount, // Update function
    deleteAccount  // Delete function
  } = useAccounts();

  // All state management is handled by the hook
}
```

## Common Patterns

### 1. Fetch on Mount
```javascript
function AccountList() {
  const { accounts, loading, fetchAccounts } = useAccounts();
  
  useEffect(() => {
    fetchAccounts();
  }, []); // Empty deps = run once on mount
}
```

### 2. Search with Debouncing
```javascript
function TransactionSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { transactions, updateFilters } = useTransactions();
  
  useEffect(() => {
    updateFilters({ q: debouncedSearch });
  }, [debouncedSearch]);
}
```

### 3. Pagination
```javascript
function TransactionList() {
  const {
    transactions,
    pagination,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useTransactions();
  
  return (
    <>
      {/* Render transactions */}
      <button onClick={prevPage} disabled={!hasPrevPage}>Prev</button>
      <button onClick={nextPage} disabled={!hasNextPage}>Next</button>
    </>
  );
}
```

### 4. Forms with Mutations
```javascript
function CreateAccountForm() {
  const { createAccount, loading } = useAccounts();
  
  const handleSubmit = async (formData) => {
    try {
      await createAccount(formData);
      // Success handled in hook
    } catch (error) {
      // Error handled in hook
    }
  };
}
```

## TypeScript Migration Preparation

### Current (.js)
```javascript
// useAccounts.js
export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  // ...
}
```

### Future (.ts)
```typescript
// useAccounts.ts
import { Account, CreateAccountInput } from '@/types/api.types';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  const createAccount = async (data: CreateAccountInput): Promise<Account> => {
    // TypeScript will enforce types
  };
}
```

## Hook Composition

Create specialized hooks by composing base hooks:

```javascript
// Custom hook for account dashboard
function useAccountDashboard() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { stats, loading: statsLoading } = useTransactionStats();
  
  return {
    accounts,
    stats,
    loading: accountsLoading || statsLoading,
    totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    accountsByType: groupBy(accounts, 'type'),
  };
}
```

## Best Practices

### 1. **Keep Hooks Simple**
- One hook per resource (useAccounts, useTransactions)
- Compose hooks for complex features

### 2. **Handle State in Hooks**
- Loading, error, and data state
- Optimistic updates
- Cache management (if needed)

### 3. **Use Built-in React Features**
- useState for local state
- useEffect for side effects
- useCallback for stable callbacks
- useMemo for expensive computations

### 4. **Avoid Over-Engineering**
- Don't recreate Redux if you don't need it
- Component state is fine for UI state
- Hooks handle resource state

### 5. **Error Handling**
- Show user-friendly messages
- Use toast notifications
- Provide retry mechanisms

## Common Mistakes to Avoid

### 1. **Don't Use Hooks Conditionally**
```javascript
// ❌ Wrong
if (needAccounts) {
  const { accounts } = useAccounts();
}

// ✅ Correct
const { accounts } = useAccounts();
if (needAccounts) {
  // Use accounts
}
```

### 2. **Don't Forget Dependencies**
```javascript
// ❌ Wrong - missing dependency
useEffect(() => {
  fetchAccounts({ filter: categoryId });
}, []); // categoryId missing!

// ✅ Correct
useEffect(() => {
  fetchAccounts({ filter: categoryId });
}, [categoryId, fetchAccounts]);
```

### 3. **Don't Mutate State**
```javascript
// ❌ Wrong
accounts.push(newAccount);
setAccounts(accounts);

// ✅ Correct
setAccounts([...accounts, newAccount]);
```

## Examples

See `/src/hooks/api/REACT_PATTERNS_EXAMPLE.jsx` for comprehensive examples of:
- Basic CRUD operations
- Pagination and filtering
- Search with debouncing
- Bulk operations
- Error handling and retry
- Real-time updates

## Summary

React hooks provide a clean, functional approach to managing API calls and state. Unlike Angular's service-based architecture, React embraces:

- **Functional composition** over class inheritance
- **Hooks** for reusable stateful logic
- **Component-level state** over global state management
- **Built-in React features** over external libraries

This approach results in more maintainable, testable, and truly React-idiomatic code.