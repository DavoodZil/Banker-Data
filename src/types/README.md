# Types Directory - TypeScript Type Patterns & Best Practices

This directory contains TypeScript type definitions, interfaces, and type utilities that provide type safety across the application. These types are shared between React components, hooks, API functions, and utilities.

## 📁 Structure

```
src/types/
├── example.ts             # Example types demonstrating patterns
├── README.md             # This file
├── index.ts              # Main export file
├── api.types.ts          # API-related types
├── global.d.ts           # Global type declarations
├── components.ts         # Component prop types
├── hooks.ts              # Hook return types
├── api.ts                # API request/response types
└── utils.ts              # Utility types
```

## 🎯 TypeScript Patterns & Best Practices

### 1. Interface Definitions

**React/Angular Interface Pattern:**
```tsx
// Base entity interface
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Extended entity interface
interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  lastLogin?: string;
  preferences: UserPreferences;
}

// Enum definitions
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}
```

**Angular Equivalent:**
```typescript
// Same interfaces can be used in Angular
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  lastLogin?: string;
  preferences: UserPreferences;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### 2. Component Prop Types

**React Component Props:**
```tsx
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onStatusChange?: (userId: string, status: UserStatus) => void;
  showActions?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  error?: string | null;
}

// Usage in component
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  variant = 'default',
  loading = false
}) => {
  // Component implementation
};
```

**Angular Component Inputs:**
```typescript
export interface UserCardInputs {
  user: User;
  showActions?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  error?: string | null;
}

@Component({
  selector: 'app-user-card',
  template: `...`
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() showActions = true;
  @Input() className = '';
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{userId: string, status: UserStatus}>();
}
```

### 3. API Request/Response Types

**React API Types:**
```tsx
// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Paginated response type
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Request types
interface CreateUserRequest {
  name: string;
  email: string;
  role?: UserRole;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

// Filter types
interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}
```

**Angular API Types:**
```typescript
// Same types can be used in Angular services
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsers(filters: UserFilters): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>('/api/users', { params: filters });
  }
  
  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/api/users', userData);
  }
  
  updateUser(id: string, updates: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`/api/users/${id}`, updates);
  }
}
```

### 4. Hook Return Types

**React Hook Types:**
```tsx
interface UseUserDataReturn {
  // State
  users: User[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  
  // Actions
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<User>;
  updateUser: (id: string, updates: UpdateUserRequest) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  
  // Computed values
  activeUsers: User[];
  usersByRole: Record<UserRole, User[]>;
  
  // Utilities
  getUserById: (id: string) => User | undefined;
  isLoading: boolean;
  hasError: boolean;
}

// Usage in custom hook
export const useUserData = (): UseUserDataReturn => {
  // Hook implementation
};
```

**Angular Service Types:**
```typescript
// Angular services can return similar structured observables
export interface UserServiceState {
  users: User[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private stateSubject = new BehaviorSubject<UserServiceState>({
    users: [],
    loading: false,
    error: null,
    lastFetched: null
  });
  
  state$ = this.stateSubject.asObservable();
  
  get users$() {
    return this.state$.pipe(map(state => state.users));
  }
  
  get loading$() {
    return this.state$.pipe(map(state => state.loading));
  }
  
  get error$() {
    return this.state$.pipe(map(state => state.error));
  }
}
```

### 5. Utility Types

**React/Angular Utility Types:**
```tsx
// Make all properties optional
type PartialUser = Partial<User>;
type PartialTransaction = Partial<Transaction>;

// Make specific properties required
type RequiredUserFields = Required<Pick<User, 'name' | 'email' | 'role'>>;

// Omit specific properties
type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Pick specific properties
type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'role' | 'status'>;

// Union types
type UserAction = 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
type Theme = 'light' | 'dark' | 'auto';

// Intersection types
type UserWithPermissions = User & {
  permissions: string[];
  lastActivity: string;
};

// Generic types
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

## 🔧 Type Best Practices

### 1. Naming Conventions

```tsx
// ✅ Good naming
interface UserCardProps { }
interface CreateUserRequest { }
interface UseUserDataReturn { }
type UserAction = 'create' | 'update' | 'delete';

// ❌ Bad naming
interface Props { } // Too generic
interface userCardProps { } // Wrong casing
interface UserCardPropsType { } // Redundant "Type"
```

### 2. Interface vs Type

```tsx
// ✅ Use interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Use type for unions, intersections, and primitives
type UserRole = 'admin' | 'user' | 'guest';
type UserWithPermissions = User & { permissions: string[] };
type UserId = string;

// ❌ Don't use type for simple object shapes
type User = {
  id: string;
  name: string;
  email: string;
};
```

### 3. Optional Properties

```tsx
// ✅ Good - use optional properties appropriately
interface UserCardProps {
  user: User; // Required
  onEdit?: (user: User) => void; // Optional
  className?: string; // Optional
  loading?: boolean; // Optional with default
}

// ❌ Bad - everything optional
interface UserCardProps {
  user?: User;
  onEdit?: (user: User) => void;
  className?: string;
  loading?: boolean;
}
```

### 4. Generic Types

```tsx
// ✅ Good - generic types for reusability
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Usage
const userResponse: ApiResponse<User> = { /* ... */ };
const usersResponse: PaginatedResponse<User> = { /* ... */ };
```

### 5. Type Guards

```tsx
// ✅ Good - type guards for runtime checking
export const isUser = (obj: any): obj is User => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.email === 'string' &&
         Object.values(UserRole).includes(obj.role);
};

// Usage
const processData = (data: any) => {
  if (isUser(data)) {
    // TypeScript knows data is User type
    console.log(data.name);
  }
};
```

## 🚀 Common Type Patterns

### 1. Component Props Pattern

```tsx
// Base props interface
interface BaseComponentProps {
  className?: string;
  loading?: boolean;
  error?: string | null;
}

// Extended props for specific components
interface UserCardProps extends BaseComponentProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

interface TransactionListProps extends BaseComponentProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  showPagination?: boolean;
  pageSize?: number;
}
```

### 2. API Response Pattern

```tsx
// Generic response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Specific response types
type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;
type PaginatedUsersResponse = ApiResponse<PaginatedResponse<User>>;

// Request types
interface CreateUserRequest {
  name: string;
  email: string;
  role?: UserRole;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}
```

### 3. Hook Return Pattern

```tsx
// Base hook return interface
interface BaseHookReturn<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Extended hook return for CRUD operations
interface CrudHookReturn<T, CreateRequest, UpdateRequest> extends BaseHookReturn<T[]> {
  create: (data: CreateRequest) => Promise<T>;
  update: (id: string, data: UpdateRequest) => Promise<T>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => T | undefined;
}

// Specific hook return types
type UseUsersReturn = CrudHookReturn<User, CreateUserRequest, UpdateUserRequest>;
type UseTransactionsReturn = CrudHookReturn<Transaction, CreateTransactionRequest, UpdateTransactionRequest>;
```

### 4. Filter Pattern

```tsx
// Base filter interface
interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Specific filter interfaces
interface UserFilters extends BaseFilters {
  role?: UserRole;
  status?: UserStatus;
  dateFrom?: string;
  dateTo?: string;
}

interface TransactionFilters extends BaseFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
}
```

## 🔄 Migration from Angular Types

### Key Differences:

| React Types | Angular Types |
|-------------|---------------|
| Direct imports | Dependency injection with types |
| Component props | @Input/@Output decorators |
| Hook return types | Service observable types |
| Generic types | Generic services |
| Type guards | Runtime validation |

### Migration Checklist:
- [ ] Convert Angular models to TypeScript interfaces
- [ ] Replace @Input/@Output with prop interfaces
- [ ] Convert service types to hook return types
- [ ] Update generic type usage
- [ ] Convert Angular pipes to utility types
- [ ] Update import statements
- [ ] Convert Angular validators to type guards

### Migration Example:

**Angular Types:**
```typescript
// Angular model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Angular component
@Component({
  selector: 'app-user-card',
  template: `...`
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();
}

// Angular service
@Injectable()
export class UserService {
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
```

**React Types:**
```tsx
// Same interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Component props
export interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

// Hook return type
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}
```

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Angular TypeScript](https://angular.io/guide/typescript-configuration)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) 