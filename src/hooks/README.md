# Hooks Directory - React Custom Hooks & Patterns

This directory contains custom React hooks that encapsulate reusable logic and state management. Custom hooks are the React equivalent of Angular services and provide a clean way to share stateful logic between components.

## 📁 Structure

```
src/hooks/
├── example.ts              # Example custom hook demonstrating patterns
├── README.md              # This file
├── api/                   # API-related hooks
│   ├── useAccounts.ts     # Account management hook
│   ├── useTransactions.ts # Transaction management hook
│   └── ...
├── useAuth.ts             # Authentication hook
├── useBankData.ts         # Bank data management hook
├── usePlaidLinkToken.ts   # Plaid integration hook
└── use-mobile.tsx         # Mobile detection hook
```

## 🎯 Custom Hook Patterns & Best Practices

### 1. Basic Custom Hook Structure

**React Custom Hook:**
```tsx
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseExampleOptions {
  initialValue?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseExampleReturn {
  data: any;
  loading: boolean;
  error: string | null;
  actions: {
    fetch: () => Promise<void>;
    update: (data: any) => Promise<void>;
  };
}

export const useExample = (options: UseExampleOptions = {}): UseExampleReturn => {
  // 1. State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Computed values
  const processedData = useMemo(() => {
    return data ? transformData(data) : null;
  }, [data]);

  // 3. Actions with useCallback
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
      options.onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options.onSuccess, options.onError]);

  // 4. Side effects
  useEffect(() => {
    fetch();
  }, [fetch]);

  // 5. Return interface
  return {
    data: processedData,
    loading,
    error,
    actions: { fetch }
  };
};
```

**Angular Service Equivalent:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
  
  async fetch(): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    try {
      const response = await this.http.get('/endpoint').toPromise();
      this.dataSubject.next(response);
    } catch (error) {
      this.errorSubject.next(error.message);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
```

### 2. State Management Patterns

**React (useState with complex state):**
```tsx
// Single state object for related data
const [state, setState] = useState({
  data: null,
  loading: false,
  error: null,
  lastFetched: null
});

// Update specific parts
const updateState = (updates: Partial<typeof state>) => {
  setState(prev => ({ ...prev, ...updates }));
};

// Functional updates for complex logic
const addItem = (newItem: any) => {
  setState(prev => ({
    ...prev,
    data: [...(prev.data || []), newItem]
  }));
};
```

**Angular (BehaviorSubject with state object):**
```typescript
interface State {
  data: any;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@Injectable()
export class StateService {
  private stateSubject = new BehaviorSubject<State>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null
  });
  
  state$ = this.stateSubject.asObservable();
  
  updateState(updates: Partial<State>) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...updates
    });
  }
}
```

### 3. API Integration Patterns

**React Custom Hook for API:**
```tsx
export const useApiData = <T>(endpoint: string, options: {
  autoFetch?: boolean;
  refreshInterval?: number;
  transform?: (data: any) => T;
}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint);
      const transformedData = options.transform 
        ? options.transform(response.data)
        : response.data;
      setData(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options.transform]);
  
  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);
  
  return { data, loading, error, refetch: fetchData };
};
```

**Angular Service for API:**
```typescript
@Injectable()
export class ApiService<T> {
  private dataSubject = new BehaviorSubject<T | null>(null);
  data$ = this.dataSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
  
  async fetchData(endpoint: string, transform?: (data: any) => T): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    try {
      const response = await this.http.get(endpoint).toPromise();
      const transformedData = transform ? transform(response) : response;
      this.dataSubject.next(transformedData);
    } catch (error) {
      this.errorSubject.next(error.message);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
```

### 4. Form Handling Patterns

**React Form Hook:**
```tsx
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);
  
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setErrors(err.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
};
```

**Angular Reactive Forms:**
```typescript
@Injectable()
export class FormService {
  createForm<T>(initialValues: T): FormGroup {
    const controls: { [key: string]: FormControl } = {};
    
    Object.keys(initialValues).forEach(key => {
      controls[key] = new FormControl(initialValues[key]);
    });
    
    return new FormGroup(controls);
  }
  
  handleSubmit<T>(form: FormGroup, onSubmit: (values: T) => Promise<void>) {
    if (form.valid) {
      return onSubmit(form.value);
    }
  }
}
```

### 5. Event Handling Patterns

**React Event Hook:**
```tsx
export const useEventHandler = () => {
  const [isHandling, setIsHandling] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  
  const handleEvent = useCallback(async (
    event: any,
    handler: (event: any) => Promise<void>
  ) => {
    setIsHandling(true);
    setLastEvent(event);
    
    try {
      await handler(event);
    } catch (error) {
      console.error('Event handling error:', error);
    } finally {
      setIsHandling(false);
    }
  }, []);
  
  return { isHandling, lastEvent, handleEvent };
};
```

**Angular Event Service:**
```typescript
@Injectable()
export class EventService {
  private handlingSubject = new BehaviorSubject<boolean>(false);
  handling$ = this.handlingSubject.asObservable();
  
  async handleEvent(event: any, handler: (event: any) => Promise<void>) {
    this.handlingSubject.next(true);
    
    try {
      await handler(event);
    } catch (error) {
      console.error('Event handling error:', error);
    } finally {
      this.handlingSubject.next(false);
    }
  }
}
```

## 🔧 Hook Rules & Best Practices

### 1. Naming Conventions
- **Always start with "use"** - This is a React requirement
- **Use descriptive names** - `useAccountData` not `useData`
- **Be specific** - `useTransactionFilters` not `useFilters`

```tsx
// ✅ Good names
export const useAccountData = () => {};
export const useTransactionFilters = () => {};
export const useFormValidation = () => {};

// ❌ Bad names
export const useData = () => {}; // Too generic
export const useFilters = () => {}; // Too generic
export const accountData = () => {}; // Missing "use" prefix
```

### 2. Return Value Structure
```tsx
// ✅ Consistent return structure
export const useExample = () => {
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Actions
  const fetch = useCallback(() => {}, []);
  const update = useCallback(() => {}, []);
  
  // Computed values
  const processedData = useMemo(() => {}, [data]);
  
  return {
    // State
    data,
    loading,
    error,
    
    // Actions
    actions: {
      fetch,
      update
    },
    
    // Computed values
    processedData
  };
};
```

### 3. Error Handling
```tsx
export const useApiCall = (endpoint: string) => {
  const [error, setError] = useState<string | null>(null);
  
  const makeCall = useCallback(async () => {
    setError(null);
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    }
  }, [endpoint]);
  
  return { error, makeCall };
};
```

### 4. Cleanup and Memory Management
```tsx
export const useSubscription = (source: Observable<any>) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const subscription = source.subscribe(setData);
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [source]);
  
  return data;
};
```

## 🚀 Common Hook Patterns

### 1. Data Fetching Hook
```tsx
export const useDataFetching = <T>(
  endpoint: string,
  options: {
    autoFetch?: boolean;
    transform?: (data: any) => T;
    dependencies?: any[];
  } = {}
) => {
  const { autoFetch = true, transform, dependencies = [] } = options;
  
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null
  });
  
  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.get(endpoint);
      const transformedData = transform ? transform(response.data) : response.data;
      setState(prev => ({ ...prev, data: transformedData, loading: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.message, 
        loading: false 
      }));
    }
  }, [endpoint, transform]);
  
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch, ...dependencies]);
  
  return { ...state, refetch: fetchData };
};
```

### 2. Local Storage Hook
```tsx
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
};
```

### 3. Debounced Hook
```tsx
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
```

### 4. Modal Hook
```tsx
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  
  const openModal = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);
  
  return {
    isOpen,
    data,
    openModal,
    closeModal
  };
};
```

## 🔄 Migration from Angular Services

### Key Differences:

| React Custom Hook | Angular Service |
|-------------------|-----------------|
| Functional approach | Class-based approach |
| useState for state | BehaviorSubject for state |
| useEffect for side effects | Constructor/ngOnInit for initialization |
| useCallback for methods | Class methods |
| Return object with state/actions | Observable properties |
| Hook composition | Service composition |

### Migration Checklist:
- [ ] Convert service class to custom hook function
- [ ] Replace BehaviorSubject with useState
- [ ] Convert Observable properties to returned values
- [ ] Replace class methods with useCallback functions
- [ ] Convert constructor logic to useEffect
- [ ] Replace dependency injection with hook parameters
- [ ] Convert async methods to async functions in hooks

## 📚 Additional Resources

- [React Custom Hooks Documentation](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hooks)
- [Angular Services Documentation](https://angular.io/guide/architecture-services)
- [React vs Angular State Management](https://react.dev/learn/managing-state) 