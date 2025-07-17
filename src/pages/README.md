# Pages Directory - React Patterns & Best Practices

This directory contains page-level components that represent full pages in your application. Each page should follow React best practices and demonstrate proper hook usage.

## 📁 Structure

```
src/pages/
├── example.tsx          # Example page demonstrating patterns
├── README.md           # This file
├── Dashboard.tsx       # Main dashboard page
├── Accounts.tsx        # Accounts management page
├── Transactions.tsx    # Transactions listing page
└── ...                 # Other page components
```

## 🎯 React Patterns & Best Practices

### 1. Functional Components with Hooks

**React Approach:**
```tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

export default function ExamplePage() {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Computed values
  const filteredData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  // Side effects
  useEffect(() => {
    // Fetch data on mount
  }, []);
  
  return <div>Page content</div>;
}
```

**Angular Equivalent:**
```typescript
@Component({
  selector: 'app-example-page',
  templateUrl: './example-page.component.html'
})
export class ExamplePageComponent implements OnInit {
  data: any[] = [];
  loading = false;
  
  get filteredData() {
    return this.data.filter(item => item.active);
  }
  
  ngOnInit() {
    // Fetch data on init
  }
  
  handleClick() {
    // Handle click
  }
}
```

### 2. State Management

**React (useState):**
```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);

// Update state
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);
```

**Angular (Class Properties):**
```typescript
export class MyComponent {
  count = 0;
  user: User | null = null;
  items: Item[] = [];
  
  incrementCount() {
    this.count++;
  }
  
  addItem(item: Item) {
    this.items.push(item);
  }
}
```

### 3. Side Effects (useEffect)

**React useEffect Patterns:**

```tsx
// 1. Run once on mount (componentDidMount)
useEffect(() => {
  fetchData();
}, []); // Empty dependency array

// 2. Run when dependencies change
useEffect(() => {
  fetchData(userId);
}, [userId]); // Runs when userId changes

// 3. Cleanup on unmount (componentWillUnmount)
useEffect(() => {
  const subscription = api.subscribe();
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);

// 4. Run on every render (use with caution)
useEffect(() => {
  console.log('Component rendered');
}); // No dependency array
```

**Angular Lifecycle Hooks:**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // ComponentDidMount equivalent
    this.fetchData();
  }
  
  ngOnDestroy() {
    // Cleanup
    this.subscription.unsubscribe();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // When @Input properties change
    if (changes['userId']) {
      this.fetchData(changes['userId'].currentValue);
    }
  }
}
```

### 4. Performance Optimization

**React (useMemo & useCallback):**
```tsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize event handlers
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // Empty deps = never changes

// Memoize child components
const MemoizedChild = React.memo(ChildComponent);
```

**Angular (OnPush Strategy):**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // Only updates when @Input changes or events occur
}
```

### 5. Custom Hooks

**React Custom Hook:**
```tsx
// hooks/useApiData.ts
export const useApiData = (endpoint: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
};

// Usage in component
const { data, loading, error } = useApiData('/users');
```

**Angular Service:**
```typescript
@Injectable()
export class ApiService {
  private dataSubject = new BehaviorSubject(null);
  data$ = this.dataSubject.asObservable();
  
  fetchData(endpoint: string) {
    return this.http.get(endpoint).pipe(
      tap(data => this.dataSubject.next(data))
    );
  }
}
```

## 🔧 Hook Rules & Best Practices

### 1. Rules of Hooks
- **Only call hooks at the top level** (not inside loops, conditions, or nested functions)
- **Only call hooks from React functions** (components or custom hooks)
- **Hook names must start with "use"**

```tsx
// ✅ Correct
function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {}, []);
  return <div>{count}</div>;
}

// ❌ Wrong - hook in condition
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0); // This breaks the rules!
  }
  return <div></div>;
}
```

### 2. useEffect Dependencies

**Always include all dependencies:**
```tsx
// ❌ Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId not in deps

// ✅ Correct
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId included
```

**Use useCallback to stabilize functions:**
```tsx
const fetchData = useCallback(async (id: string) => {
  const response = await api.get(`/users/${id}`);
  setData(response.data);
}, []); // Stable function reference

useEffect(() => {
  fetchData(userId);
}, [fetchData, userId]);
```

### 3. State Updates

**Use functional updates for state that depends on previous state:**
```tsx
// ❌ Potential race condition
setCount(count + 1);

// ✅ Safe functional update
setCount(prev => prev + 1);

// ❌ Potential issue with arrays/objects
setItems([...items, newItem]);

// ✅ Safe functional update
setItems(prev => [...prev, newItem]);
```

## 📱 Page Structure Template

```tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageData {
  // Define your data structure
}

export default function YourPage() {
  // 1. State management
  const [data, setData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Navigation
  const navigate = useNavigate();
  
  // 3. Custom hooks
  const { someData } = useCustomHook();
  
  // 4. Computed values
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);
  
  // 5. Event handlers
  const handleAction = useCallback(async () => {
    setLoading(true);
    try {
      // API call
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 6. Side effects
  useEffect(() => {
    // Initial data fetch
  }, []);
  
  // 7. Loading state
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // 8. Error state
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  // 9. Main render
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Page Title</h1>
        <Button onClick={handleAction}>Action</Button>
      </div>
      
      {/* Content */}
      <div className="grid gap-4">
        {processedData.map(item => (
          <Card key={item.id}>
            <CardContent>{/* Item content */}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## 🚀 Common Patterns

### 1. Data Fetching Pattern
```tsx
const useDataFetching = (endpoint: string) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });
  
  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.get(endpoint);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err.message, 
        loading: false 
      }));
    }
  }, [endpoint]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { ...state, refetch: fetchData };
};
```

### 2. Form Handling Pattern
```tsx
const useForm = (initialValues: any) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);
  
  const handleSubmit = useCallback(async (onSubmit: Function) => {
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors(err.errors);
    }
  }, [values]);
  
  return { values, errors, handleChange, handleSubmit };
};
```

### 3. Modal/Dialog Pattern
```tsx
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  
  const openModal = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);
  
  return { isOpen, data, openModal, closeModal };
};
```

## 🔄 Migration from Angular

### Key Differences:

| React | Angular |
|-------|---------|
| Functional components | Class components |
| useState/useEffect | Properties/lifecycle hooks |
| Custom hooks | Services |
| JSX | Template files |
| Props | @Input/@Output |
| Context | Dependency injection |

### Migration Checklist:
- [ ] Convert class components to functional components
- [ ] Replace lifecycle hooks with useEffect
- [ ] Convert services to custom hooks
- [ ] Replace templates with JSX
- [ ] Convert @Input/@Output to props
- [ ] Replace dependency injection with Context or props

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Patterns](https://reactpatterns.com/)
- [Angular to React Migration Guide](https://react.dev/learn/thinking-in-react)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks) 