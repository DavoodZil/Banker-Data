/**
 * Example TypeScript Types and Interfaces
 * 
 * This demonstrates TypeScript type patterns and best practices:
 * - Interface definitions for data structures
 * - Type unions and intersections
 * - Generic types
 * - Utility types
 * - Type guards and assertions
 * - API response types
 * - Component prop types
 * 
 * Angular Comparison:
 * - React: TypeScript interfaces and types
 * - Angular: TypeScript interfaces and types (similar approach)
 * - React: Direct type usage
 * - Angular: Dependency injection with types
 * - React: Generic types for components
 * - Angular: Generic types for services
 */

// ============================================================================
// BASE ENTITY TYPES
// ============================================================================

/**
 * Base entity interface with common fields
 * 
 * React: Used for API responses and state management
 * Angular: Used for models and services
 */
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User entity type
 * 
 * React: Used in components, hooks, and API calls
 * Angular: Used in components, services, and models
 */
interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  lastLogin?: string;
  preferences: UserPreferences;
}

/**
 * Account entity type
 * 
 * React: Used for financial data management
 * Angular: Used for account services and components
 */
interface Account extends BaseEntity {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string;
  accountNumber?: string;
  status: AccountStatus;
  lastSync?: string;
  transactions: Transaction[];
}

/**
 * Transaction entity type
 * 
 * React: Used for transaction management and display
 * Angular: Used for transaction services and components
 */
interface Transaction extends BaseEntity {
  amount: number;
  description: string;
  category: Category;
  type: TransactionType;
  date: string;
  accountId: string;
  merchant?: Merchant;
  tags: Tag[];
  notes?: string;
  isRecurring: boolean;
  recurringId?: string;
}

// ============================================================================
// ENUM TYPES
// ============================================================================

/**
 * User role enumeration
 * 
 * React: Used for authorization and UI rendering
 * Angular: Used for guards and role-based components
 */
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

/**
 * User status enumeration
 * 
 * React: Used for user management and display
 * Angular: Used for user services and status indicators
 */
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

/**
 * Account type enumeration
 * 
 * React: Used for account categorization and display
 * Angular: Used for account services and type-specific logic
 */
enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT = 'credit',
  INVESTMENT = 'investment',
  LOAN = 'loan'
}

/**
 * Account status enumeration
 * 
 * React: Used for account state management
 * Angular: Used for account status indicators
 */
enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
  PENDING = 'pending'
}

/**
 * Transaction type enumeration
 * 
 * React: Used for transaction categorization
 * Angular: Used for transaction filtering and display
 */
enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  REFUND = 'refund'
}

// ============================================================================
// RELATED ENTITY TYPES
// ============================================================================

/**
 * Category entity type
 * 
 * React: Used for transaction categorization
 * Angular: Used for category management
 */
interface Category extends BaseEntity {
  name: string;
  color: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  budget?: number;
  isDefault: boolean;
}

/**
 * Merchant entity type
 * 
 * React: Used for transaction merchant information
 * Angular: Used for merchant services
 */
interface Merchant extends BaseEntity {
  name: string;
  logo?: string;
  website?: string;
  category?: Category;
  isVerified: boolean;
}

/**
 * Tag entity type
 * 
 * React: Used for transaction tagging
 * Angular: Used for tag management
 */
interface Tag extends BaseEntity {
  name: string;
  color: string;
  description?: string;
}

/**
 * User preferences type
 * 
 * React: Used for user settings and preferences
 * Angular: Used for user preference services
 */
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

/**
 * Notification settings type
 * 
 * React: Used for notification management
 * Angular: Used for notification services
 */
interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: {
    transactions: boolean;
    budgets: boolean;
    security: boolean;
  };
}

/**
 * Privacy settings type
 * 
 * React: Used for privacy management
 * Angular: Used for privacy services
 */
interface PrivacySettings {
  shareData: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Generic API response wrapper
 * 
 * React: Used for API client functions
 * Angular: Used for HTTP service responses
 */
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

/**
 * Paginated response type
 * 
 * React: Used for paginated data fetching
 * Angular: Used for paginated service responses
 */
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

/**
 * API request types
 * 
 * React: Used for API function parameters
 * Angular: Used for service method parameters
 */
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
  preferences?: Partial<UserPreferences>;
}

interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'description';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * User card component props
 * 
 * React: Used for component props interface
 * Angular: Used for @Input properties
 */
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

/**
 * Transaction list component props
 * 
 * React: Used for component props interface
 * Angular: Used for @Input properties
 */
interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onCategorize?: (transactionId: string, categoryId: string) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showPagination?: boolean;
  pageSize?: number;
}

/**
 * Account overview component props
 * 
 * React: Used for component props interface
 * Angular: Used for @Input properties
 */
interface AccountOverviewProps {
  account: Account;
  onRefresh?: () => void;
  onEdit?: (account: Account) => void;
  onDelete?: (accountId: string) => void;
  showTransactions?: boolean;
  transactionLimit?: number;
  loading?: boolean;
  error?: string | null;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Custom hook return types
 * 
 * React: Used for custom hook interfaces
 * Angular: Used for service observable types
 */
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

interface UseTransactionDataReturn {
  // State
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  createTransaction: (transactionData: Partial<Transaction>) => Promise<Transaction>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Computed values
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionsByCategory: Record<string, Transaction[]>;
  
  // Utilities
  getTransactionById: (id: string) => Transaction | undefined;
  isLoading: boolean;
  hasError: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional
 * 
 * React: Used for partial updates
 * Angular: Used for partial model updates
 */
type PartialUser = Partial<User>;
type PartialTransaction = Partial<Transaction>;
type PartialAccount = Partial<Account>;

/**
 * Make specific properties required
 * 
 * React: Used for required fields in forms
 * Angular: Used for required model properties
 */
type RequiredUserFields = Required<Pick<User, 'name' | 'email' | 'role'>>;
type RequiredTransactionFields = Required<Pick<Transaction, 'amount' | 'description' | 'type'>>;

/**
 * Omit specific properties
 * 
 * React: Used for creating new entities without IDs
 * Angular: Used for creating new models
 */
type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Pick specific properties
 * 
 * React: Used for selecting specific fields
 * Angular: Used for selecting model properties
 */
type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'role' | 'status'>;
type TransactionSummary = Pick<Transaction, 'id' | 'amount' | 'description' | 'date' | 'type'>;

/**
 * Union types
 * 
 * React: Used for flexible prop types
 * Angular: Used for flexible service parameters
 */
type UserAction = 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
type TransactionAction = 'categorize' | 'split' | 'merge' | 'duplicate';
type Theme = 'light' | 'dark' | 'auto';

/**
 * Intersection types
 * 
 * React: Used for combining types
 * Angular: Used for extending interfaces
 */
type UserWithPermissions = User & {
  permissions: string[];
  lastActivity: string;
};

type TransactionWithMetadata = Transaction & {
  metadata: {
    source: string;
    confidence: number;
    processed: boolean;
  };
};

// ============================================================================
// GENERIC TYPES
// ============================================================================

/**
 * Generic API response type
 * 
 * React: Used for typed API responses
 * Angular: Used for typed HTTP responses
 */
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Generic paginated response type
 * 
 * React: Used for paginated data
 * Angular: Used for paginated services
 */
type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Generic filter type
 * 
 * React: Used for filter interfaces
 * Angular: Used for filter services
 */
type BaseFilters = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Generic entity filters
 * 
 * React: Used for entity filtering
 * Angular: Used for entity services
 */
type EntityFilters<T> = BaseFilters & {
  [K in keyof T]?: T[K];
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard functions
 * 
 * React: Used for runtime type checking
 * Angular: Used for runtime validation
 */
export const isUser = (obj: any): obj is User => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.email === 'string' &&
         Object.values(UserRole).includes(obj.role);
};

export const isTransaction = (obj: any): obj is Transaction => {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.amount === 'number' &&
         typeof obj.description === 'string' &&
         Object.values(TransactionType).includes(obj.type);
};

export const isAccount = (obj: any): obj is Account => {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.balance === 'number' &&
         Object.values(AccountType).includes(obj.type);
};

/**
 * Array type guards
 * 
 * React: Used for array validation
 * Angular: Used for array services
 */
export const isUserArray = (arr: any[]): arr is User[] => {
  return Array.isArray(arr) && arr.every(isUser);
};

export const isTransactionArray = (arr: any[]): arr is Transaction[] => {
  return Array.isArray(arr) && arr.every(isTransaction);
};

export const isAccountArray = (arr: any[]): arr is Account[] => {
  return Array.isArray(arr) && arr.every(isAccount);
};

// ============================================================================
// CONSTANT TYPES
// ============================================================================

/**
 * Constant type assertions
 * 
 * React: Used for constant values
 * Angular: Used for constant services
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT: 'credit',
  INVESTMENT: 'investment',
  LOAN: 'loan'
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  REFUND: 'refund'
} as const;

/**
 * Type from constants
 * 
 * React: Used for derived types
 * Angular: Used for derived interfaces
 */
type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];
type AccountTypeType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];
type TransactionTypeType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Base types
  BaseEntity,
  User,
  Account,
  Transaction,
  Category,
  Merchant,
  Tag,
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  
  // API types
  ApiResponse,
  PaginatedResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  TransactionFilters,
  
  // Component types
  UserCardProps,
  TransactionListProps,
  AccountOverviewProps,
  
  // Hook types
  UseUserDataReturn,
  UseTransactionDataReturn,
  
  // Utility types
  PartialUser,
  PartialTransaction,
  PartialAccount,
  RequiredUserFields,
  RequiredTransactionFields,
  CreateUserData,
  CreateTransactionData,
  UserSummary,
  TransactionSummary,
  UserAction,
  TransactionAction,
  Theme,
  UserWithPermissions,
  TransactionWithMetadata,
  BaseFilters,
  EntityFilters,
  UserRoleType,
  AccountTypeType,
  TransactionTypeType
};

export {
  // Enums
  UserRole,
  UserStatus,
  AccountType,
  AccountStatus,
  TransactionType,
  
  // Type guards
  isUser,
  isTransaction,
  isAccount,
  isUserArray,
  isTransactionArray,
  isAccountArray,
  
  // Constants
  USER_ROLES,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES
};

/**
 * Example usage:
 * 
 * ```tsx
 * import { 
 *   User, 
 *   UserRole, 
 *   UserCardProps, 
 *   isUser,
 *   ApiResponse 
 * } from '@/types/example';
 * 
 * // Component with typed props
 * const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
 *   return (
 *     <div>
 *       <h3>{user.name}</h3>
 *       <p>{user.email}</p>
 *       <span>{user.role}</span>
 *     </div>
 *   );
 * };
 * 
 * // API function with typed response
 * const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
 *   const response = await api.get('/users');
 *   return response.data;
 * };
 * 
 * // Type guard usage
 * const processData = (data: any) => {
 *   if (isUser(data)) {
 *     // TypeScript knows data is User type
 *     console.log(data.name);
 *   }
 * };
 * ```
 */

/**
 * Angular Equivalent Types:
 * 
 * ```typescript
 * // Same interfaces can be used in Angular
 * export interface User extends BaseEntity {
 *   name: string;
 *   email: string;
 *   role: UserRole;
 *   // ... same properties
 * }
 * 
 * // Angular service with typed methods
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class UserService {
 *   getUsers(): Observable<ApiResponse<User[]>> {
 *     return this.http.get<ApiResponse<User[]>>('/api/users');
 *   }
 *   
 *   createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
 *     return this.http.post<ApiResponse<User>>('/api/users', userData);
 *   }
 * }
 * 
 * // Angular component with typed inputs
 * @Component({
 *   selector: 'app-user-card',
 *   template: `...`
 * })
 * export class UserCardComponent {
 *   @Input() user!: User;
 *   @Input() onEdit?: (user: User) => void;
 *   
 *   // Same type guards can be used
 *   processData(data: any) {
 *     if (isUser(data)) {
 *       console.log(data.name);
 *     }
 *   }
 * }
 * ```
 */ 