import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * Example Component: UserCard
 * 
 * This demonstrates React component patterns and best practices:
 * - Functional components with TypeScript
 * - Props interface definition
 * - State management with hooks
 * - Event handling and callbacks
 * - Performance optimization
 * - Accessibility features
 * - Component composition
 * - Forward refs and imperative handles
 * 
 * Angular Comparison:
 * - React: Functional component with props
 * - Angular: Class component with @Input/@Output decorators
 * - React: useState for local state
 * - Angular: Class properties and change detection
 * - React: useCallback for event handlers
 * - Angular: Component methods
 * - React: forwardRef for refs
 * - Angular: ViewChild/ViewChildren decorators
 */

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onStatusChange?: (userId: string, status: 'active' | 'inactive') => void;
  showActions?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
  error?: string | null;
}

interface UserCardRef {
  focus: () => void;
  scrollIntoView: () => void;
  getUserData: () => User;
}

/**
 * UserCard Component
 * 
 * A reusable card component for displaying user information with various
 * interaction options and styling variants.
 */
export const UserCard = forwardRef<UserCardRef, UserCardProps>(({
  user,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
  className = '',
  variant = 'default',
  loading = false,
  error = null
}, ref) => {
  // Local state management
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [localUser, setLocalUser] = useState<User>(user);

  // Computed values with useMemo
  const statusColor = useMemo(() => {
    return localUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }, [localUser.status]);

  const roleColor = useMemo(() => {
    switch (localUser.role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [localUser.role]);

  const lastLoginText = useMemo(() => {
    if (!localUser.lastLogin) return 'Never logged in';
    const date = new Date(localUser.lastLogin);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }, [localUser.lastLogin]);

  // Event handlers with useCallback
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    onEdit?.(localUser);
  }, [localUser, onEdit]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(localUser.id);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [localUser.id, onDelete]);

  const handleStatusToggle = useCallback(async () => {
    const newStatus = localUser.status === 'active' ? 'inactive' : 'active';
    try {
      await onStatusChange?.(localUser.id, newStatus);
      setLocalUser(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  }, [localUser.id, localUser.status, onStatusChange]);

  const handleNameChange = useCallback((newName: string) => {
    setLocalUser(prev => ({ ...prev, name: newName }));
  }, []);

  // Side effects
  useEffect(() => {
    // Update local state when user prop changes
    setLocalUser(user);
  }, [user]);

  // Imperative handle for parent component access
  useImperativeHandle(ref, () => ({
    focus: () => {
      // Focus the card element
      const cardElement = document.querySelector(`[data-user-id="${user.id}"]`);
      if (cardElement instanceof HTMLElement) {
        cardElement.focus();
      }
    },
    scrollIntoView: () => {
      // Scroll the card into view
      const cardElement = document.querySelector(`[data-user-id="${user.id}"]`);
      if (cardElement instanceof HTMLElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    getUserData: () => localUser
  }), [user.id, localUser]);

  // Loading state
  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`} data-user-id={user.id}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`} data-user-id={user.id}>
        <CardContent className="pt-6">
          <div className="text-red-600 text-sm">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card 
        className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
        data-user-id={user.id}
        tabIndex={0}
        role="button"
        onClick={handleEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEdit();
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {localUser.avatar ? (
                <img 
                  src={localUser.avatar} 
                  alt={localUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {localUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-sm">{localUser.name}</h3>
                <p className="text-xs text-gray-500">{localUser.email}</p>
              </div>
            </div>
            <Badge className={statusColor} variant="secondary">
              {localUser.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <Card className={`${className}`} data-user-id={user.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {localUser.avatar ? (
                <img 
                  src={localUser.avatar} 
                  alt={localUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {localUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{localUser.name}</CardTitle>
                <p className="text-gray-600">{localUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={roleColor} variant="secondary">
                    {localUser.role}
                  </Badge>
                  <Badge className={statusColor} variant="secondary">
                    {localUser.status}
                  </Badge>
                </div>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isEditing}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusToggle}
                  disabled={isDeleting}
                >
                  {localUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Are you sure you want to delete {localUser.name}?</p>
                      <p className="text-sm text-gray-500">
                        This action cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowConfirmDelete(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Login:</span>
              <span className="text-sm">{lastLoginText}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">User ID:</span>
              <span className="text-sm font-mono text-gray-500">{localUser.id}</span>
            </div>
            {isEditing && (
              <div className="space-y-2 pt-4 border-t">
                <Input
                  value={localUser.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter name"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => setIsEditing(false)}>
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setLocalUser(user); // Reset to original
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`hover:shadow-lg transition-all ${className}`} data-user-id={user.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {localUser.avatar ? (
              <img 
                src={localUser.avatar} 
                alt={localUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-medium text-gray-600">
                  {localUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <CardTitle className="text-base">{localUser.name}</CardTitle>
              <p className="text-sm text-gray-500">{localUser.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={roleColor} variant="secondary">
              {localUser.role}
            </Badge>
            <Badge className={statusColor} variant="secondary">
              {localUser.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Login:</span>
            <span className="text-sm">{lastLoginText}</span>
          </div>
          {showActions && (
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isEditing}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStatusToggle}
                disabled={isDeleting}
              >
                {localUser.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Are you sure you want to delete {localUser.name}?</p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Set display name for debugging
UserCard.displayName = 'UserCard';

/**
 * Example usage:
 * 
 * ```tsx
 * import { UserCard } from '@/components/example';
 * 
 * function UserList() {
 *   const userCardRef = useRef<UserCardRef>(null);
 * 
 *   const handleEdit = (user: User) => {
 *     console.log('Editing user:', user);
 *   };
 * 
 *   const handleDelete = async (userId: string) => {
 *     // API call to delete user
 *     await deleteUser(userId);
 *   };
 * 
 *   const handleStatusChange = async (userId: string, status: 'active' | 'inactive') => {
 *     // API call to update user status
 *     await updateUserStatus(userId, status);
 *   };
 * 
 *   return (
 *     <div className="grid gap-4">
 *       <UserCard
 *         ref={userCardRef}
 *         user={{
 *           id: '1',
 *           name: 'John Doe',
 *           email: 'john@example.com',
 *           role: 'admin',
 *           status: 'active',
 *           lastLogin: '2024-01-15T10:30:00Z'
 *         }}
 *         onEdit={handleEdit}
 *         onDelete={handleDelete}
 *         onStatusChange={handleStatusChange}
 *         variant="detailed"
 *         showActions={true}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Angular Equivalent Component:
 * 
 * ```typescript
 * @Component({
 *   selector: 'app-user-card',
 *   template: `
 *     <mat-card [class]="className" [attr.data-user-id]="user.id">
 *       <mat-card-header>
 *         <img mat-card-avatar [src]="user.avatar" [alt]="user.name" *ngIf="user.avatar">
 *         <div mat-card-avatar class="avatar-placeholder" *ngIf="!user.avatar">
 *           {{ user.name.charAt(0).toUpperCase() }}
 *         </div>
 *         <mat-card-title>{{ user.name }}</mat-card-title>
 *         <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
 *         <mat-chip-list>
 *           <mat-chip [color]="getRoleColor()">{{ user.role }}</mat-chip>
 *           <mat-chip [color]="getStatusColor()">{{ user.status }}</mat-chip>
 *         </mat-chip-list>
 *       </mat-card-header>
 *       
 *       <mat-card-content>
 *         <p>Last Login: {{ getLastLoginText() }}</p>
 *         
 *         <div class="actions" *ngIf="showActions">
 *           <button mat-button (click)="onEdit()">Edit</button>
 *           <button mat-button (click)="onStatusToggle()">
 *             {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
 *           </button>
 *           <button mat-button color="warn" (click)="onDelete()">Delete</button>
 *         </div>
 *       </mat-card-content>
 *     </mat-card>
 *   `,
 *   styleUrls: ['./user-card.component.css']
 * })
 * export class UserCardComponent implements OnInit {
 *   @Input() user: User;
 *   @Input() showActions = true;
 *   @Input() className = '';
 *   @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
 *   @Input() loading = false;
 *   @Input() error: string | null = null;
 *   
 *   @Output() edit = new EventEmitter<User>();
 *   @Output() delete = new EventEmitter<string>();
 *   @Output() statusChange = new EventEmitter<{userId: string, status: string}>();
 *   
 *   @ViewChild('cardElement') cardElement: ElementRef;
 *   
 *   ngOnInit() {
 *     // Component initialization
 *   }
 *   
 *   onEdit() {
 *     this.edit.emit(this.user);
 *   }
 *   
 *   onDelete() {
 *     this.delete.emit(this.user.id);
 *   }
 *   
 *   onStatusToggle() {
 *     const newStatus = this.user.status === 'active' ? 'inactive' : 'active';
 *     this.statusChange.emit({ userId: this.user.id, status: newStatus });
 *   }
 *   
 *   getRoleColor() {
 *     switch (this.user.role) {
 *       case 'admin': return 'accent';
 *       case 'user': return 'primary';
 *       case 'guest': return 'warn';
 *       default: return 'primary';
 *     }
 *   }
 *   
 *   getStatusColor() {
 *     return this.user.status === 'active' ? 'primary' : 'warn';
 *   }
 *   
 *   getLastLoginText() {
 *     if (!this.user.lastLogin) return 'Never logged in';
 *     const date = new Date(this.user.lastLogin);
 *     const now = new Date();
 *     const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
 *     
 *     if (diffInDays === 0) return 'Today';
 *     if (diffInDays === 1) return 'Yesterday';
 *     if (diffInDays < 7) return `${diffInDays} days ago`;
 *     return date.toLocaleDateString();
 *   }
 *   
 *   // Public methods for parent component access
 *   focus() {
 *     this.cardElement.nativeElement.focus();
 *   }
 *   
 *   scrollIntoView() {
 *     this.cardElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
 *   }
 *   
 *   getUserData(): User {
 *     return this.user;
 *   }
 * }
 * ```
 */ 