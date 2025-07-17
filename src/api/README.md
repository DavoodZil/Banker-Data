# API Directory - React API Patterns & Best Practices

This directory contains API client functions that handle communication with backend services. Unlike Angular's service-based approach, React uses functional API clients that provide a clean, composable interface for data fetching and manipulation.

## 📁 Structure

```
src/api/
├── example.ts              # Example API client demonstrating patterns
├── README.md              # This file
├── client.ts              # Main API client functions
└── types/                 # API-specific type definitions
    ├── requests.ts        # Request interfaces
    ├── responses.ts       # Response interfaces
    └── common.ts          # Shared types
```

## 🎯 API Patterns & Best Practices

### 1. Functional API Clients

**React Approach (Functional):**
```tsx
// Functional API client
export const userApi = {
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });

      const response = await api.get(`/users?${params.toString()}`);
      return transformPaginatedResponse(response.data, transformUser);
    } catch (error) {
      handleApiError(error);
    }
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  update: async (id: string, updates: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, updates);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }
};
```

**Angular Approach (Service Class):**
```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(filters: UserFilters = {}): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('role', filters.role || '')
      .set('search', filters.search || '')
      .set('page', filters.page?.toString() || '1');

    return this.http.get<ApiResponse<any>>('/api/users', { params })
      .pipe(
        map(response => transformPaginatedResponse(response, transformUser)),
        catchError(this.handleError)
      );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>('/api/users', userData)
      .pipe(
        map(response => transformUser(response.data)),
        catchError(this.handleError)
      );
  }

  updateUser(id: string, updates: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<any>>(`/api/users/${id}`, updates)
      .pipe(
        map(response => transformUser(response.data)),
        catchError(this.handleError)
      );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete(`/api/users/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }
}
```

### 2. TypeScript Interfaces

**React API Types:**
```tsx
// Request interfaces
interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest';
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
}

interface UserFilters {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Response interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

**Angular API Types:**
```typescript
// Same interfaces can be used in Angular
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest';
}
```

### 3. Error Handling

**React Error Handling:**
```tsx
// Custom error class
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handler utility
const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    throw new ApiError(
      data.message || `HTTP ${status} Error`,
      status,
      data.code,
      data.errors
    );
  } else if (error.request) {
    // Network error
    throw new ApiError('Network error - no response received', 0);
  } else {
    // Other error
    throw new ApiError(error.message || 'Unknown error', 0);
  }
};

// Usage in API functions
export const userApi = {
  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  }
};
```

**Angular Error Handling:**
```typescript
@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>('/api/users', userData)
      .pipe(
        map(response => transformUser(response.data)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `HTTP ${error.status} Error`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### 4. Response Transformation

**React Transformation:**
```tsx
// Transform functions
const transformUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  createdAt: data.created_at || data.createdAt,
  updatedAt: data.updated_at || data.updatedAt
});

const transformPaginatedResponse = <T>(
  response: any,
  transformItem: (item: any) => T
): PaginatedResponse<T> => ({
  data: response.data.map(transformItem),
  pagination: {
    page: response.pagination?.page || 1,
    limit: response.pagination?.limit || 10,
    total: response.pagination?.total || 0,
    totalPages: response.pagination?.total_pages || 0
  }
});

// Usage in API functions
export const userApi = {
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const response = await api.get(`/users`, { params: filters });
    return transformPaginatedResponse(response.data, transformUser);
  }
};
```

**Angular Transformation:**
```typescript
// Same transform functions
const transformUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  createdAt: data.created_at || data.createdAt,
  updatedAt: data.updated_at || data.updatedAt
});

@Injectable()
export class UserService {
  getUsers(filters: UserFilters = {}): Observable<PaginatedResponse<User>> {
    return this.http.get<ApiResponse<any>>('/api/users', { params: filters })
      .pipe(
        map(response => transformPaginatedResponse(response, transformUser))
      );
  }
}
```

## 🔧 API Patterns & Best Practices

### 1. Consistent API Structure

```tsx
// Standard CRUD operations
export const resourceApi = {
  // List with pagination and filters
  list: async (filters: Filters = {}): Promise<PaginatedResponse<Resource>> => {},
  
  // Get single item
  get: async (id: string): Promise<Resource> => {},
  
  // Create new item
  create: async (data: CreateRequest): Promise<Resource> => {},
  
  // Update item
  update: async (id: string, updates: UpdateRequest): Promise<Resource> => {},
  
  // Partial update
  patch: async (id: string, updates: Partial<UpdateRequest>): Promise<Resource> => {},
  
  // Delete item
  delete: async (id: string): Promise<void> => {},
  
  // Resource-specific operations
  customAction: async (id: string, data: any): Promise<any> => {}
};
```

### 2. Request/Response Interceptors

```tsx
// Authentication interceptor
const withAuth = (config: any) => ({
  ...config,
  headers: {
    ...config.headers,
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Retry interceptor
const withRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

// Usage
export const userApi = {
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    return withRetry(async () => {
      const response = await api.get('/users', withAuth({ params: filters }));
      return transformPaginatedResponse(response.data, transformUser);
    });
  }
};
```

### 3. Caching Patterns

```tsx
// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data;
  }

  const data = await fn();
  cache.set(key, { data, timestamp: now, ttl });
  return data;
};

// Usage
export const userApi = {
  get: async (id: string): Promise<User> => {
    const cacheKey = `user:${id}`;
    return withCache(cacheKey, async () => {
      const response = await api.get(`/users/${id}`);
      return transformUser(response.data);
    });
  }
};
```

### 4. File Upload Patterns

```tsx
export const fileApi = {
  upload: async (
    file: File, 
    onUploadProgress?: (progress: number) => void
  ): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      }
    });

    return { url: response.data.url };
  }
};
```

## 🚀 Advanced Patterns

### 1. Bulk Operations

```tsx
export const userApi = {
  // Bulk delete
  bulkDelete: async (userIds: string[]): Promise<void> => {
    await api.post('/users/bulk-delete', { user_ids: userIds });
  },

  // Bulk update
  bulkUpdate: async (
    userIds: string[], 
    updates: UpdateUserRequest
  ): Promise<User[]> => {
    const response = await api.post('/users/bulk-update', {
      user_ids: userIds,
      updates
    });
    return response.data.map(transformUser);
  },

  // Bulk create
  bulkCreate: async (users: CreateUserRequest[]): Promise<User[]> => {
    const response = await api.post('/users/bulk-create', { users });
    return response.data.map(transformUser);
  }
};
```

### 2. Search and Filtering

```tsx
export const userApi = {
  // Search with autocomplete
  search: async (query: string, limit: number = 10): Promise<User[]> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data.map(transformUser);
  },

  // Advanced filtering
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (filters.role) params.append('role', filters.role);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sort_by', filters.sortBy);
    if (filters.sortOrder) params.append('sort_order', filters.sortOrder);

    const response = await api.get(`/users?${params.toString()}`);
    return transformPaginatedResponse(response.data, transformUser);
  }
};
```

### 3. Real-time Updates

```tsx
// WebSocket integration
export const realtimeApi = {
  subscribe: (event: string, callback: (data: any) => void) => {
    // WebSocket subscription logic
    const ws = new WebSocket('ws://api.example.com');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close(); // Return cleanup function
  },

  // Server-sent events
  subscribeToEvents: (eventSource: string, callback: (data: any) => void) => {
    const eventSource = new EventSource(eventSource);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => eventSource.close(); // Return cleanup function
  }
};
```

## 🔄 Migration from Angular Services

### Key Differences:

| React API Client | Angular Service |
|------------------|-----------------|
| Functional approach | Class-based approach |
| Direct function calls | Dependency injection |
| Promise-based | Observable-based |
| Async/await syntax | RxJS operators |
| No dependency injection | Injectable decorator |
| Composable functions | Service methods |

### Migration Checklist:
- [ ] Convert service class to functional API client
- [ ] Replace Observable with Promise/async-await
- [ ] Convert RxJS operators to async/await
- [ ] Remove dependency injection
- [ ] Convert service methods to exported functions
- [ ] Replace error handling patterns
- [ ] Update component usage patterns

### Migration Example:

**Angular Service:**
```typescript
@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
      .pipe(
        map(users => users.map(transformUser)),
        catchError(this.handleError)
      );
  }
}
```

**React API Client:**
```tsx
export const userApi = {
  list: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      return response.data.map(transformUser);
    } catch (error) {
      handleApiError(error);
    }
  }
};
```

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Angular HttpClient](https://angular.io/guide/http)
- [React Data Fetching Patterns](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- [TypeScript API Patterns](https://www.typescriptlang.org/docs/handbook/interfaces.html) 