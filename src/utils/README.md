# Utils Directory - React Utility Patterns & Best Practices

This directory contains utility functions that provide reusable, pure functions for common operations. These utilities follow functional programming principles and are designed to be easily testable and composable.

## 📁 Structure

```
src/utils/
├── example.ts             # Example utility functions demonstrating patterns
├── README.md             # This file
├── index.ts              # Main export file
├── auth.ts               # Authentication utilities
├── iframeCommunication.ts # Iframe communication utilities
├── date.ts               # Date and time utilities
├── currency.ts           # Currency and number formatting
├── validation.ts         # Form and data validation
├── storage.ts            # Local storage utilities
├── url.ts                # URL and routing utilities
└── data.ts               # Data transformation utilities
```

## 🎯 Utility Patterns & Best Practices

### 1. Pure Functions

**React Approach (Pure Functions):**
```tsx
// Pure function - same input always produces same output
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

// Pure function with type safety
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

// Pure function with validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

**Angular Approach (Service Methods):**
```typescript
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // Static methods (pure functions)
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  // Instance methods (can have dependencies)
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return UtilityService.formatCurrency(amount, currency);
  }
  
  calculateTotalBalance(accounts: Account[]): number {
    return accounts.reduce((total, account) => total + account.balance, 0);
  }
  
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

### 2. Type-Safe Utilities

**React Type-Safe Utilities:**
```tsx
// Generic utility functions
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

// Type-safe storage utilities
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
  }
};

// Type-safe validation
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
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

**Angular Type-Safe Utilities:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // Generic utility functions
  static groupBy<T, K extends keyof T>(
    array: T[], 
    key: K
  ): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
  
  // Type-safe storage
  getFromStorage<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }
  
  setToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }
}
```

### 3. Date and Time Utilities

**React Date Utilities:**
```tsx
export const dateUtils = {
  // Format date to human-readable string
  format: (date: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  },
  
  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return dateObj.toLocaleDateString();
  },
  
  // Check if date is today
  isToday: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },
  
  // Get start and end of month
  getMonthRange: (date: Date = new Date()): { start: Date; end: Date } => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }
};
```

**Angular Date Utilities:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class DateService {
  format(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  }
  
  getRelativeTime(date: string | Date): string {
    // Same implementation as React version
  }
  
  isToday(date: string | Date): boolean {
    // Same implementation as React version
  }
  
  getMonthRange(date: Date = new Date()): { start: Date; end: Date } {
    // Same implementation as React version
  }
}
```

### 4. String and Formatting Utilities

**React String Utilities:**
```tsx
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // Convert to title case
  toTitleCase: (str: string): string => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => stringUtils.capitalize(word))
      .join(' ');
  },
  
  // Truncate with ellipsis
  truncate: (str: string, maxLength: number, suffix: string = '...'): string => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  },
  
  // Generate initials from name
  getInitials: (name: string): string => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
};
```

**Angular String Utilities:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class StringService {
  capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  toTitleCase(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }
  
  truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
}
```

### 5. Data Transformation Utilities

**React Data Utilities:**
```tsx
export const dataUtils = {
  // Group array by key
  groupBy: <T, K extends keyof T>(
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
  },
  
  // Sort array by multiple criteria
  sortBy: <T>(
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
  },
  
  // Filter array by multiple conditions
  filterBy: <T>(
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
  },
  
  // Remove duplicates
  removeDuplicates: <T>(array: T[], key?: keyof T): T[] => {
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
  }
};
```

**Angular Data Utilities:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
  
  sortBy<T>(
    array: T[], 
    ...criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
  ): T[] {
    return [...array].sort((a, b) => {
      for (const { key, direction } of criteria) {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  filterBy<T>(array: T[], filters: Partial<Record<keyof T, any>>): T[] {
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
  }
  
  removeDuplicates<T>(array: T[], key?: keyof T): T[] {
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
  }
}
```

## 🔧 Utility Best Practices

### 1. Pure Functions
```tsx
// ✅ Good - Pure function
export const add = (a: number, b: number): number => {
  return a + b;
};

// ❌ Bad - Impure function (side effects)
export const addWithLogging = (a: number, b: number): number => {
  console.log('Adding numbers:', a, b); // Side effect
  return a + b;
};
```

### 2. Type Safety
```tsx
// ✅ Good - Type-safe utility
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// ❌ Bad - No type safety
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
```

### 3. Error Handling
```tsx
// ✅ Good - Safe utility with error handling
export const safeJsonParse = <T>(json: string, defaultValue?: T): T | null => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue || null;
  }
};

// ❌ Bad - No error handling
export const parseJson = <T>(json: string): T => {
  return JSON.parse(json); // Can throw error
};
```

### 4. Immutability
```tsx
// ✅ Good - Immutable operations
export const addItem = <T>(array: T[], item: T): T[] => {
  return [...array, item];
};

export const updateItem = <T>(
  array: T[], 
  index: number, 
  item: T
): T[] => {
  return array.map((existingItem, i) => 
    i === index ? item : existingItem
  );
};

// ❌ Bad - Mutating operations
export const addItem = <T>(array: T[], item: T): T[] => {
  array.push(item); // Mutates original array
  return array;
};
```

## 🚀 Common Utility Patterns

### 1. Debounce and Throttle
```tsx
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
```

### 2. Retry Logic
```tsx
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
```

### 3. URL Utilities
```tsx
export const urlUtils = {
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  },
  
  parseQueryString: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  },
  
  buildUrl: (baseUrl: string, params?: Record<string, any>): string => {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }
    
    const queryString = urlUtils.buildQueryString(params);
    return `${baseUrl}?${queryString}`;
  }
};
```

## 🔄 Migration from Angular Services

### Key Differences:

| React Utilities | Angular Services |
|-----------------|------------------|
| Pure functions | Injectable services |
| Direct imports | Dependency injection |
| No side effects | Can have side effects |
| Functional approach | Object-oriented approach |
| Static methods | Instance methods |
| No dependencies | Can have dependencies |

### Migration Checklist:
- [ ] Convert service methods to pure functions
- [ ] Remove dependency injection
- [ ] Convert instance methods to static functions
- [ ] Remove side effects where possible
- [ ] Update import statements
- [ ] Convert Angular pipes to utility functions
- [ ] Update component usage patterns

### Migration Example:

**Angular Service:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
}
```

**React Utilities:**
```tsx
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

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
```

## 📚 Additional Resources

- [Functional Programming in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Functional_programming)
- [Pure Functions](https://en.wikipedia.org/wiki/Pure_function)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Angular Services](https://angular.io/guide/architecture-services)
- [React Best Practices](https://react.dev/learn/thinking-in-react) 