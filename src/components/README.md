# Components Directory - React Component Patterns & Best Practices

This directory contains reusable React components that follow modern patterns and best practices. Components are organized by feature and demonstrate proper TypeScript usage, accessibility, and performance optimization.

## 📁 Structure

```
src/components/
├── example.tsx            # Example component demonstrating patterns
├── README.md             # This file
├── ui/                   # Base UI components (shadcn/ui)
│   ├── button.tsx        # Button component
│   ├── card.tsx          # Card component
│   ├── input.tsx         # Input component
│   └── ...
├── accounts/             # Account-related components
│   ├── AccountCard.tsx   # Account display card
│   ├── AccountDetailsChart.tsx # Account charts
│   └── ...
├── transactions/         # Transaction-related components
│   ├── TransactionList.tsx # Transaction listing
│   ├── TransactionFilters.tsx # Filter controls
│   └── ...
├── dashboard/            # Dashboard components
│   ├── AccountOverview.tsx # Account summary
│   ├── SpendingChart.tsx # Spending visualization
│   └── ...
└── auth/                 # Authentication components
    ├── AuthHelper.tsx    # Auth utilities
    ├── ProtectedRoute.tsx # Route protection
    └── ...
```

## 🎯 Component Patterns & Best Practices

### 1. Functional Components with TypeScript

**React Approach:**
```tsx
import React, { useState, useCallback, useMemo } from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  loading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  variant = 'default',
  className = '',
  loading = false
}) => {
  // Component logic here
  return (
    <div className={`user-card ${className}`}>
      {/* Component JSX */}
    </div>
  );
};
```

**Angular Equivalent:**
```typescript
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user: User;
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() className = '';
  @Input() loading = false;
  
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<string>();
  
  onEdit() {
    this.edit.emit(this.user);
  }
  
  onDelete() {
    this.delete.emit(this.user.id);
  }
}
```

### 2. Props Interface Definition

**React Props Pattern:**
```tsx
// Define clear, typed interfaces for props
interface ComponentProps {
  // Required props
  title: string;
  data: DataType[];
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  error?: string | null;
  
  // Event handlers
  onClick?: (item: DataType) => void;
  onDelete?: (id: string) => Promise<void>;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
  
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Use destructuring with defaults
export const Component: React.FC<ComponentProps> = ({
  title,
  data,
  variant = 'primary',
  size = 'md',
  loading = false,
  error = null,
  onClick,
  onDelete,
  className = '',
  style,
  ...ariaProps
}) => {
  // Component implementation
};
```

**Angular Input/Output Pattern:**
```typescript
export interface ComponentInputs {
  title: string;
  data: DataType[];
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  error?: string | null;
}

@Component({
  selector: 'app-component',
  template: `...`
})
export class ComponentClass {
  @Input() title: string;
  @Input() data: DataType[];
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() click = new EventEmitter<DataType>();
  @Output() delete = new EventEmitter<string>();
}
```

### 3. State Management in Components

**React State Pattern:**
```tsx
export const Component: React.FC<Props> = ({ data }) => {
  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Computed state with useMemo
  const filteredData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);
  
  // Event handlers with useCallback
  const handleClick = useCallback((item: Item) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);
  
  return (
    // Component JSX
  );
};
```

**Angular State Pattern:**
```typescript
@Component({
  selector: 'app-component',
  template: `...`
})
export class ComponentClass {
  // Local state as class properties
  isOpen = false;
  selectedItem: Item | null = null;
  loading = false;
  error: string | null = null;
  
  // Computed properties (getters)
  get filteredData(): Item[] {
    return this.data.filter(item => item.active);
  }
  
  get sortedData(): Item[] {
    return [...this.filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // Event handlers as methods
  handleClick(item: Item) {
    this.selectedItem = item;
    this.isOpen = true;
  }
  
  handleClose() {
    this.isOpen = false;
    this.selectedItem = null;
  }
}
```

### 4. Event Handling

**React Event Pattern:**
```tsx
export const Component: React.FC<Props> = ({ onSave, onDelete }) => {
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      await onSave(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  }, [onSave]);
  
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  }, [onDelete]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Save</button>
      <button type="button" onClick={() => handleDelete('123')}>
        Delete
      </button>
    </form>
  );
};
```

**Angular Event Pattern:**
```typescript
@Component({
  selector: 'app-component',
  template: `
    <form (ngSubmit)="handleSubmit($event)">
      <!-- Form fields -->
      <button type="submit">Save</button>
      <button type="button" (click)="handleDelete('123')">
        Delete
      </button>
    </form>
  `
})
export class ComponentClass {
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  
  async handleSubmit(event: Event) {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      this.save.emit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  }
  
  async handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        this.delete.emit(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  }
}
```

### 5. Forward Refs and Imperative Handles

**React Ref Pattern:**
```tsx
interface ComponentRef {
  focus: () => void;
  scrollIntoView: () => void;
  getValue: () => string;
}

interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export const Component = forwardRef<ComponentRef, ComponentProps>(({
  value,
  onChange
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    scrollIntoView: () => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    getValue: () => value
  }), [value]);
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

Component.displayName = 'Component';
```

**Angular ViewChild Pattern:**
```typescript
@Component({
  selector: 'app-component',
  template: `
    <input #inputRef [value]="value" (input)="onChange($event.target.value)">
  `
})
export class ComponentClass {
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  
  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;
  
  onChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
  
  // Public methods for parent access
  focus() {
    this.inputRef.nativeElement.focus();
  }
  
  scrollIntoView() {
    this.inputRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  getValue(): string {
    return this.value;
  }
}
```

## 🔧 Component Best Practices

### 1. Naming Conventions

```tsx
// ✅ Good component names
export const UserCard = () => {};
export const TransactionList = () => {};
export const AccountOverview = () => {};

// ❌ Bad component names
export const Card = () => {}; // Too generic
export const userCard = () => {}; // Not PascalCase
export const User_Card = () => {}; // Wrong casing
```

### 2. File Organization

```
components/
├── UserCard/
│   ├── index.tsx          # Main component
│   ├── UserCard.tsx       # Component implementation
│   ├── UserCard.test.tsx  # Tests
│   ├── UserCard.stories.tsx # Storybook stories
│   └── UserCard.module.css # Styles (if using CSS modules)
├── TransactionList/
│   ├── index.tsx
│   ├── TransactionList.tsx
│   └── ...
```

### 3. Component Composition

```tsx
// Parent component
export const UserDashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <UserCard user={user} onEdit={handleEdit} />
      <TransactionList transactions={transactions} />
      <AccountOverview account={account} />
    </div>
  );
};

// Child components
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <Card>
      <CardHeader>
        <Avatar src={user.avatar} alt={user.name} />
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <UserDetails user={user} />
        <UserActions onEdit={onEdit} />
      </CardContent>
    </Card>
  );
};
```

### 4. Accessibility

```tsx
export const AccessibleComponent: React.FC<Props> = ({ label, description }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-describedby="description"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Handle click
        }
      }}
    >
      <span id="description">{description}</span>
    </div>
  );
};
```

### 5. Performance Optimization

```tsx
// Memoize expensive components
export const ExpensiveComponent = React.memo<Props>(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => heavyProcessing(item));
  }, [data]);
  
  const handleAction = useCallback((item: Item) => {
    onAction(item);
  }, [onAction]);
  
  return (
    <div>
      {processedData.map(item => (
        <ItemComponent key={item.id} item={item} onAction={handleAction} />
      ))}
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';
```

## 🚀 Common Component Patterns

### 1. Loading States

```tsx
export const LoadingComponent: React.FC<Props> = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-600">
        Error: {error}
      </div>
    );
  }
  
  return <>{children}</>;
};
```

### 2. Error Boundaries

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 3. Modal/Dialog Components

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## 🔄 Migration from Angular Components

### Key Differences:

| React Component | Angular Component |
|-----------------|-------------------|
| Functional component | Class component |
| Props interface | @Input/@Output decorators |
| useState for state | Class properties |
| useEffect for lifecycle | Lifecycle hooks |
| useCallback for methods | Class methods |
| forwardRef for refs | ViewChild/ViewChildren |
| JSX template | HTML template |
| CSS-in-JS or CSS modules | Component styles |

### Migration Checklist:
- [ ] Convert class component to functional component
- [ ] Replace @Input with props interface
- [ ] Replace @Output with callback props
- [ ] Convert class properties to useState
- [ ] Replace lifecycle hooks with useEffect
- [ ] Convert template to JSX
- [ ] Replace ViewChild with forwardRef
- [ ] Update styling approach
- [ ] Convert Angular pipes to JavaScript functions

## 📚 Additional Resources

- [React Components Documentation](https://react.dev/learn/your-first-component)
- [TypeScript with React](https://www.typescriptlang.org/docs/handbook/react.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Angular Components](https://angular.io/guide/component-overview)
- [React vs Angular Components](https://react.dev/learn/thinking-in-react) 