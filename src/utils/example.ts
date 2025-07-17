/**
 * Example Utility Functions
 * 
 * This demonstrates React utility patterns and best practices:
 * - Pure functions for data transformation
 * - Type-safe utility functions
 * - Date and time utilities
 * - String manipulation utilities
 * - Validation utilities
 * - Formatting utilities
 * - Common business logic utilities
 * 
 * Angular Comparison:
 * - React: Pure utility functions
 * - Angular: Injectable services or static methods
 * - React: Direct function imports
 * - Angular: Dependency injection or static class methods
 * - React: Functional programming approach
 * - Angular: Object-oriented approach
 */

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  lastLogin?: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
}

// ============================================================================
// DATE AND TIME UTILITIES
// ============================================================================

/**
 * Format date to human-readable string
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds > 0) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
};

/**
 * Check if date is today
 * 
 * React: Pure function
 * Angular: Static method
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Get start and end of month
 * 
 * React: Pure function
 * Angular: Static method
 */
export const getMonthRange = (date: Date = new Date()): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return { start, end };
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const toTitleCase = (str: string): string => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncate string with ellipsis
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Generate initials from name
 * 
 * React: Pure function
 * Angular: Static method
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// ============================================================================
// NUMBER AND CURRENCY UTILITIES
// ============================================================================

/**
 * Format currency
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format number with commas
 * 
 * React: Pure function
 * Angular: Static method or pipe
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Calculate percentage
 * 
 * React: Pure function
 * Angular: Static method
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Round to specified decimal places
 * 
 * React: Pure function
 * Angular: Static method
 */
export const roundTo = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email format
 * 
 * React: Pure function
 * Angular: Static method or validator
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * 
 * React: Pure function
 * Angular: Static method or validator
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required fields
 * 
 * React: Pure function
 * Angular: Static method or validator
 */
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Group array by key
 * 
 * React: Pure function
 * Angular: Static method
 */
export const groupBy = <T, K extends keyof T>(
  array: T[], 
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by multiple criteria
 * 
 * React: Pure function
 * Angular: Static method
 */
export const sortBy = <T>(
  array: T[], 
  ...criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, direction } of criteria) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Filter array by multiple conditions
 * 
 * React: Pure function
 * Angular: Static method
 */
export const filterBy = <T>(
  array: T[], 
  filters: Partial<Record<keyof T, any>>
): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      const itemValue = item[key as keyof T];
      
      if (typeof value === 'string') {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      
      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }
      
      return itemValue === value;
    });
  });
};

/**
 * Remove duplicates from array
 * 
 * React: Pure function
 * Angular: Static method
 */
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// ============================================================================
// BUSINESS LOGIC UTILITIES
// ============================================================================

/**
 * Calculate total balance from accounts
 * 
 * React: Pure function
 * Angular: Static method or service method
 */
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

/**
 * Calculate monthly spending
 * 
 * React: Pure function
 * Angular: Static method or service method
 */
export const calculateMonthlySpending = (
  transactions: Transaction[], 
  month: Date = new Date()
): number => {
  const { start, end } = getMonthRange(month);
  
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === 'expense' && 
             transactionDate >= start && 
             transactionDate <= end;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

/**
 * Get spending by category
 * 
 * React: Pure function
 * Angular: Static method or service method
 */
export const getSpendingByCategory = (
  transactions: Transaction[], 
  month?: Date
): Record<string, number> => {
  let filteredTransactions = transactions.filter(t => t.type === 'expense');
  
  if (month) {
    const { start, end } = getMonthRange(month);
    filteredTransactions = filteredTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }
  
  return groupBy(filteredTransactions, 'category')
    .reduce((result, [category, categoryTransactions]) => {
      result[category] = categoryTransactions.reduce(
        (sum, transaction) => sum + transaction.amount, 
        0
      );
      return result;
    }, {} as Record<string, number>);
};

/**
 * Calculate net worth trend
 * 
 * React: Pure function
 * Angular: Static method or service method
 */
export const calculateNetWorthTrend = (
  currentBalance: number, 
  previousBalance: number
): { change: number; changePercent: number; isPositive: boolean } => {
  const change = currentBalance - previousBalance;
  const changePercent = previousBalance > 0 
    ? (change / previousBalance) * 100 
    : 0;
  
  return {
    change,
    changePercent: roundTo(changePercent, 2),
    isPositive: change >= 0
  };
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Safe localStorage operations
 * 
 * React: Pure function
 * Angular: Service method
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// ============================================================================
// URL AND ROUTING UTILITIES
// ============================================================================

/**
 * Build query string from object
 * 
 * React: Pure function
 * Angular: Static method
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * Parse query string to object
 * 
 * React: Pure function
 * Angular: Static method
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Generate URL with query parameters
 * 
 * React: Pure function
 * Angular: Static method
 */
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }
  
  const queryString = buildQueryString(params);
  return `${baseUrl}?${queryString}`;
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Safe JSON parsing
 * 
 * React: Pure function
 * Angular: Static method
 */
export const safeJsonParse = <T>(json: string, defaultValue?: T): T | null => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue || null;
  }
};

/**
 * Retry function with exponential backoff
 * 
 * React: Pure function
 * Angular: Static method or service method
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

// ============================================================================
// DEBOUNCE AND THROTTLE UTILITIES
// ============================================================================

/**
 * Debounce function
 * 
 * React: Pure function
 * Angular: Static method
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * 
 * React: Pure function
 * Angular: Static method
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Example usage:
 * 
 * ```tsx
 * import { 
 *   formatCurrency, 
 *   getRelativeTime, 
 *   groupBy, 
 *   calculateTotalBalance 
 * } from '@/utils/example';
 * 
 * function AccountSummary({ accounts, transactions }) {
 *   const totalBalance = calculateTotalBalance(accounts);
 *   const spendingByCategory = getSpendingByCategory(transactions);
 *   
 *   return (
 *     <div>
 *       <h2>Total Balance: {formatCurrency(totalBalance)}</h2>
 *       <p>Last updated: {getRelativeTime(new Date())}</p>
 *       {Object.entries(spendingByCategory).map(([category, amount]) => (
 *         <div key={category}>
 *           {category}: {formatCurrency(amount)}
 *         </div>
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
 * export class UtilityService {
 *   // Date utilities
 *   formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
 *     const dateObj = typeof date === 'string' ? new Date(date) : date;
 *     const defaultOptions: Intl.DateTimeFormatOptions = {
 *       year: 'numeric',
 *       month: 'short',
 *       day: 'numeric',
 *       ...options
 *     };
 *     return dateObj.toLocaleDateString('en-US', defaultOptions);
 *   }
 *   
 *   getRelativeTime(date: string | Date): string {
 *     // Same implementation as React version
 *   }
 *   
 *   // Currency utilities
 *   formatCurrency(amount: number, currency: string = 'USD'): string {
 *     return new Intl.NumberFormat('en-US', {
 *       style: 'currency',
 *       currency: currency
 *     }).format(amount);
 *   }
 *   
 *   // Data transformation utilities
 *   groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
 *     // Same implementation as React version
 *   }
 *   
 *   // Business logic utilities
 *   calculateTotalBalance(accounts: Account[]): number {
 *     return accounts.reduce((total, account) => total + account.balance, 0);
 *   }
 * }
 * 
 * // Usage in Angular component
 * @Component({
 *   selector: 'app-account-summary',
 *   template: `
 *     <div>
 *       <h2>Total Balance: {{ formatCurrency(totalBalance) }}</h2>
 *       <p>Last updated: {{ getRelativeTime(lastUpdated) }}</p>
 *     </div>
 *   `
 * })
 * export class AccountSummaryComponent {
 *   constructor(private utilityService: UtilityService) {}
 *   
 *   formatCurrency(amount: number): string {
 *     return this.utilityService.formatCurrency(amount);
 *   }
 *   
 *   getRelativeTime(date: Date): string {
 *     return this.utilityService.getRelativeTime(date);
 *   }
 * }
 * ```
 */ 