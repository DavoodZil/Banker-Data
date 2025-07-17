import api from '@/services/api';

/**
 * Example API Client Functions
 * 
 * This demonstrates React API patterns and best practices:
 * - Functional API clients (not classes)
 * - TypeScript interfaces for type safety
 * - Error handling and response transformation
 * - Request/response interceptors
 * - Caching and optimization patterns
 * - Consistent API structure
 * 
 * Angular Comparison:
 * - React: Functional API clients
 * - Angular: Injectable service classes with HttpClient
 * - React: Direct function calls
 * - Angular: Service methods with dependency injection
 * - React: Promise-based with async/await
 * - Angular: Observable-based with RxJS
 */

// TypeScript interfaces for type safety
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

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

// Error handling utilities
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

// Response transformation utilities
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

/**
 * User API Client Functions
 * 
 * React Approach: Functional API clients
 * Angular Equivalent: Injectable service class
 */
export const userApi = {
  /**
   * Get all users with pagination and filters
   * 
   * React: Direct function call
   * Angular: this.http.get<User[]>('/api/users', { params })
   */
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sort_by', filters.sortBy);
      if (filters.sortOrder) params.append('sort_order', filters.sortOrder);

      const response = await api.get<ApiResponse<any>>(`/users?${params.toString()}`);
      
      return transformPaginatedResponse(response.data, transformUser);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get a single user by ID
   * 
   * React: userApi.get('123')
   * Angular: this.http.get<User>('/api/users/123')
   */
  get: async (id: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<any>>(`/users/${id}`);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Create a new user
   * 
   * React: userApi.create({ name: 'John', email: 'john@example.com' })
   * Angular: this.http.post<User>('/api/users', userData)
   */
  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<any>>('/users', userData);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Update an existing user
   * 
   * React: userApi.update('123', { name: 'Jane' })
   * Angular: this.http.put<User>('/api/users/123', updates)
   */
  update: async (id: string, updates: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<any>>(`/users/${id}`, updates);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Partially update a user (PATCH)
   * 
   * React: userApi.patch('123', { name: 'Jane' })
   * Angular: this.http.patch<User>('/api/users/123', updates)
   */
  patch: async (id: string, updates: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.patch<ApiResponse<any>>(`/users/${id}`, updates);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Delete a user
   * 
   * React: userApi.delete('123')
   * Angular: this.http.delete('/api/users/123')
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * User-specific endpoints
   */
  
  // Get user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<any>>('/users/profile');
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update user profile
  updateProfile: async (updates: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.patch<ApiResponse<any>>('/users/profile', updates);
      return transformUser(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Change user password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/users/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // Upload user avatar
  uploadAvatar: async (file: File, onUploadProgress?: (progress: number) => void): Promise<{ avatarUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post<ApiResponse<{ avatar_url: string }>>('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(progress);
          }
        }
      });

             return { avatarUrl: response.data.data.avatar_url };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Search users
  search: async (query: string, limit: number = 10): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data.data.map(transformUser);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Bulk operations
  bulkDelete: async (userIds: string[]): Promise<void> => {
    try {
      await api.post('/users/bulk-delete', { user_ids: userIds });
    } catch (error) {
      handleApiError(error);
    }
  },

  bulkUpdate: async (userIds: string[], updates: UpdateUserRequest): Promise<User[]> => {
    try {
      const response = await api.post<ApiResponse<any[]>>('/users/bulk-update', {
        user_ids: userIds,
        updates
      });
      return response.data.data.map(transformUser);
    } catch (error) {
      handleApiError(error);
    }
  }
};

/**
 * Example usage in React components:
 * 
 * ```tsx
 * import { userApi } from '@/api/example';
 * 
 * function UserList() {
 *   const [users, setUsers] = useState<User[]>([]);
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState<string | null>(null);
 * 
 *   const fetchUsers = async () => {
 *     setLoading(true);
 *     setError(null);
 *     try {
 *       const response = await userApi.list({ 
 *         page: 1, 
 *         limit: 10,
 *         sortBy: 'name',
 *         sortOrder: 'asc'
 *       });
 *       setUsers(response.data);
 *     } catch (err) {
 *       if (err instanceof ApiError) {
 *         setError(err.message);
 *       } else {
 *         setError('Unknown error occurred');
 *       }
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   const createUser = async (userData: CreateUserRequest) => {
 *     try {
 *       const newUser = await userApi.create(userData);
 *       setUsers(prev => [...prev, newUser]);
 *     } catch (err) {
 *       if (err instanceof ApiError) {
 *         setError(err.message);
 *       }
 *     }
 *   };
 * 
 *   useEffect(() => {
 *     fetchUsers();
 *   }, []);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {users.map(user => (
 *         <div key={user.id}>{user.name}</div>
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
 * export class UserService {
 *   constructor(private http: HttpClient) {}
 * 
 *   // Get all users
 *   getUsers(filters: UserFilters = {}): Observable<PaginatedResponse<User>> {
 *     const params = new HttpParams()
 *       .set('role', filters.role || '')
 *       .set('search', filters.search || '')
 *       .set('page', filters.page?.toString() || '1')
 *       .set('limit', filters.limit?.toString() || '10')
 *       .set('sort_by', filters.sortBy || '')
 *       .set('sort_order', filters.sortOrder || '');
 * 
 *     return this.http.get<ApiResponse<any>>('/api/users', { params })
 *       .pipe(
 *         map(response => transformPaginatedResponse(response, transformUser)),
 *         catchError(this.handleError)
 *       );
 *   }
 * 
 *   // Get single user
 *   getUser(id: string): Observable<User> {
 *     return this.http.get<ApiResponse<any>>(`/api/users/${id}`)
 *       .pipe(
 *         map(response => transformUser(response.data)),
 *         catchError(this.handleError)
 *       );
 *   }
 * 
 *   // Create user
 *   createUser(userData: CreateUserRequest): Observable<User> {
 *     return this.http.post<ApiResponse<any>>('/api/users', userData)
 *       .pipe(
 *         map(response => transformUser(response.data)),
 *         catchError(this.handleError)
 *       );
 *   }
 * 
 *   // Update user
 *   updateUser(id: string, updates: UpdateUserRequest): Observable<User> {
 *     return this.http.put<ApiResponse<any>>(`/api/users/${id}`, updates)
 *       .pipe(
 *         map(response => transformUser(response.data)),
 *         catchError(this.handleError)
 *       );
 *   }
 * 
 *   // Delete user
 *   deleteUser(id: string): Observable<void> {
 *     return this.http.delete(`/api/users/${id}`)
 *       .pipe(
 *         catchError(this.handleError)
 *       );
 *   }
 * 
 *   private handleError(error: HttpErrorResponse): Observable<never> {
 *     let errorMessage = 'An error occurred';
 *     
 *     if (error.error instanceof ErrorEvent) {
 *       // Client-side error
 *       errorMessage = error.error.message;
 *     } else {
 *       // Server-side error
 *       errorMessage = error.error?.message || `HTTP ${error.status} Error`;
 *     }
 *     
 *     return throwError(() => new Error(errorMessage));
 *   }
 * }
 * 
 * // Usage in Angular component
 * @Component({
 *   selector: 'app-user-list',
 *   template: `
 *     <div *ngIf="loading$ | async">Loading...</div>
 *     <div *ngIf="error$ | async as error">Error: {{error}}</div>
 *     <div *ngFor="let user of users$ | async">
 *       {{user.name}}
 *     </div>
 *   `
 * })
 * export class UserListComponent implements OnInit {
 *   users$ = new BehaviorSubject<User[]>([]);
 *   loading$ = new BehaviorSubject<boolean>(false);
 *   error$ = new BehaviorSubject<string | null>(null);
 * 
 *   constructor(private userService: UserService) {}
 * 
 *   ngOnInit() {
 *     this.loadUsers();
 *   }
 * 
 *   loadUsers() {
 *     this.loading$.next(true);
 *     this.error$.next(null);
 * 
 *     this.userService.getUsers({ page: 1, limit: 10 })
 *       .pipe(
 *         finalize(() => this.loading$.next(false))
 *       )
 *       .subscribe({
 *         next: (response) => this.users$.next(response.data),
 *         error: (error) => this.error$.next(error.message)
 *       });
 *   }
 * }
 * ```
 */

/**
 * Advanced API Patterns
 */

// Request/Response interceptors
const withAuth = (config: any) => ({
  ...config,
  headers: {
    ...config.headers,
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

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

// Caching utilities
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

// Enhanced API client with interceptors and caching
export const enhancedUserApi = {
  list: async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
    const cacheKey = `users:${JSON.stringify(filters)}`;
    
    return withCache(cacheKey, async () => {
      return withRetry(async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });

        const response = await api.get(`/users?${params.toString()}`, withAuth({}));
        return transformPaginatedResponse(response.data, transformUser);
      });
    });
  },

  get: async (id: string): Promise<User> => {
    const cacheKey = `user:${id}`;
    
    return withCache(cacheKey, async () => {
      return withRetry(async () => {
        const response = await api.get(`/users/${id}`, withAuth({}));
        return transformUser(response.data);
      });
    });
  }
}; 