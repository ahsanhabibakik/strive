import { IUser } from './models/User';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
}

// Define all available permissions
export const PERMISSIONS: Record<string, Permission> = {
  // User management
  'users:read': {
    id: 'users:read',
    name: 'Read Users',
    description: 'Can view user profiles and lists',
    resource: 'users',
    action: 'read'
  },
  'users:write': {
    id: 'users:write',
    name: 'Write Users',
    description: 'Can create and update user profiles',
    resource: 'users',
    action: 'write'
  },
  'users:delete': {
    id: 'users:delete',
    name: 'Delete Users',
    description: 'Can delete user accounts',
    resource: 'users',
    action: 'delete'
  },
  'users:admin': {
    id: 'users:admin',
    name: 'Admin Users',
    description: 'Full user management access',
    resource: 'users',
    action: 'admin'
  },

  // Content management
  'content:read': {
    id: 'content:read',
    name: 'Read Content',
    description: 'Can view all content',
    resource: 'content',
    action: 'read'
  },
  'content:write': {
    id: 'content:write',
    name: 'Write Content',
    description: 'Can create and edit content',
    resource: 'content',
    action: 'write'
  },
  'content:delete': {
    id: 'content:delete',
    name: 'Delete Content',
    description: 'Can delete content',
    resource: 'content',
    action: 'delete'
  },
  'content:publish': {
    id: 'content:publish',
    name: 'Publish Content',
    description: 'Can publish and unpublish content',
    resource: 'content',
    action: 'publish'
  },

  // Analytics
  'analytics:read': {
    id: 'analytics:read',
    name: 'Read Analytics',
    description: 'Can view analytics data',
    resource: 'analytics',
    action: 'read'
  },
  'analytics:export': {
    id: 'analytics:export',
    name: 'Export Analytics',
    description: 'Can export analytics data',
    resource: 'analytics',
    action: 'export'
  },

  // Billing
  'billing:read': {
    id: 'billing:read',
    name: 'Read Billing',
    description: 'Can view billing information',
    resource: 'billing',
    action: 'read'
  },
  'billing:write': {
    id: 'billing:write',
    name: 'Write Billing',
    description: 'Can manage billing and subscriptions',
    resource: 'billing',
    action: 'write'
  },

  // API Keys
  'api-keys:read': {
    id: 'api-keys:read',
    name: 'Read API Keys',
    description: 'Can view API keys',
    resource: 'api-keys',
    action: 'read'
  },
  'api-keys:write': {
    id: 'api-keys:write',
    name: 'Write API Keys',
    description: 'Can create and manage API keys',
    resource: 'api-keys',
    action: 'write'
  },
  'api-keys:delete': {
    id: 'api-keys:delete',
    name: 'Delete API Keys',
    description: 'Can delete API keys',
    resource: 'api-keys',
    action: 'delete'
  },

  // Settings
  'settings:read': {
    id: 'settings:read',
    name: 'Read Settings',
    description: 'Can view application settings',
    resource: 'settings',
    action: 'read'
  },
  'settings:write': {
    id: 'settings:write',
    name: 'Write Settings',
    description: 'Can modify application settings',
    resource: 'settings',
    action: 'write'
  },

  // System
  'system:admin': {
    id: 'system:admin',
    name: 'System Admin',
    description: 'Full system administration access',
    resource: 'system',
    action: 'admin'
  }
};

// Define roles with their permissions
export const ROLES: Record<string, Role> = {
  user: {
    id: 'user',
    name: 'User',
    description: 'Regular user with basic permissions',
    level: 1,
    permissions: [
      'content:read',
      'analytics:read',
      'billing:read',
      'api-keys:read',
      'api-keys:write',
      'api-keys:delete'
    ]
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    description: 'Content moderator with additional permissions',
    level: 2,
    permissions: [
      'users:read',
      'content:read',
      'content:write',
      'content:delete',
      'content:publish',
      'analytics:read',
      'analytics:export',
      'billing:read',
      'api-keys:read',
      'api-keys:write',
      'api-keys:delete',
      'settings:read'
    ]
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system administrator',
    level: 3,
    permissions: Object.keys(PERMISSIONS)
  }
};

export class RBAC {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: IUser, permissionId: string): boolean {
    if (!user || !user.role) return false;

    const role = ROLES[user.role];
    if (!role) return false;

    return role.permissions.includes(permissionId);
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: IUser, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId => 
      this.hasPermission(user, permissionId)
    );
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: IUser, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId => 
      this.hasPermission(user, permissionId)
    );
  }

  /**
   * Check if a user has access to a resource with a specific action
   */
  static hasResourceAccess(user: IUser, resource: string, action: string): boolean {
    const permissionId = `${resource}:${action}`;
    return this.hasPermission(user, permissionId);
  }

  /**
   * Get all permissions for a user
   */
  static getUserPermissions(user: IUser): Permission[] {
    if (!user || !user.role) return [];

    const role = ROLES[user.role];
    if (!role) return [];

    return role.permissions
      .map(permissionId => PERMISSIONS[permissionId])
      .filter(Boolean);
  }

  /**
   * Get user's role information
   */
  static getUserRole(user: IUser): Role | null {
    if (!user || !user.role) return null;
    return ROLES[user.role] || null;
  }

  /**
   * Check if user can access another user's data
   */
  static canAccessUser(currentUser: IUser, targetUserId: string): boolean {
    // Users can always access their own data
    if (currentUser._id === targetUserId) return true;

    // Check if user has admin permissions
    return this.hasPermission(currentUser, 'users:admin');
  }

  /**
   * Check if user can modify another user
   */
  static canModifyUser(currentUser: IUser, targetUser: IUser): boolean {
    // Users can modify their own data (with restrictions)
    if (currentUser._id === targetUser._id) return true;

    // Check role hierarchy - can only modify users with lower role levels
    const currentRole = this.getUserRole(currentUser);
    const targetRole = this.getUserRole(targetUser);

    if (!currentRole || !targetRole) return false;

    return currentRole.level > targetRole.level && 
           this.hasPermission(currentUser, 'users:write');
  }

  /**
   * Check if user can delete another user
   */
  static canDeleteUser(currentUser: IUser, targetUser: IUser): boolean {
    // Users cannot delete themselves
    if (currentUser._id === targetUser._id) return false;

    // Check role hierarchy and permissions
    const currentRole = this.getUserRole(currentUser);
    const targetRole = this.getUserRole(targetUser);

    if (!currentRole || !targetRole) return false;

    return currentRole.level > targetRole.level && 
           this.hasPermission(currentUser, 'users:delete');
  }

  /**
   * Filter resources based on user permissions
   */
  static filterByPermission<T extends { userId?: string }>(
    user: IUser,
    resources: T[],
    permission: string
  ): T[] {
    if (this.hasPermission(user, permission)) {
      return resources;
    }

    // If no admin permission, only return user's own resources
    return resources.filter(resource => resource.userId === user._id);
  }

  /**
   * Create a permission check middleware
   */
  static requirePermission(permissionId: string) {
    return (user: IUser) => {
      if (!this.hasPermission(user, permissionId)) {
        throw new Error(`Access denied. Required permission: ${permissionId}`);
      }
      return true;
    };
  }

  /**
   * Create a role check middleware
   */
  static requireRole(roleId: string) {
    return (user: IUser) => {
      if (!user || user.role !== roleId) {
        throw new Error(`Access denied. Required role: ${roleId}`);
      }
      return true;
    };
  }

  /**
   * Create a minimum role level check
   */
  static requireMinimumRole(minimumLevel: number) {
    return (user: IUser) => {
      const role = this.getUserRole(user);
      if (!role || role.level < minimumLevel) {
        throw new Error(`Access denied. Minimum role level required: ${minimumLevel}`);
      }
      return true;
    };
  }

  /**
   * Get available roles for assignment
   */
  static getAssignableRoles(currentUser: IUser): Role[] {
    const currentRole = this.getUserRole(currentUser);
    if (!currentRole) return [];

    // Can only assign roles with lower level than current user
    return Object.values(ROLES).filter(role => role.level < currentRole.level);
  }

  /**
   * Check if current user can assign a specific role
   */
  static canAssignRole(currentUser: IUser, targetRoleId: string): boolean {
    const currentRole = this.getUserRole(currentUser);
    const targetRole = ROLES[targetRoleId];

    if (!currentRole || !targetRole) return false;

    return currentRole.level > targetRole.level && 
           this.hasPermission(currentUser, 'users:write');
  }

  /**
   * Get permissions by resource
   */
  static getResourcePermissions(resource: string): Permission[] {
    return Object.values(PERMISSIONS).filter(permission => 
      permission.resource === resource
    );
  }

  /**
   * Get all available resources
   */
  static getResources(): string[] {
    return [...new Set(Object.values(PERMISSIONS).map(p => p.resource))];
  }

  /**
   * Get all available actions for a resource
   */
  static getResourceActions(resource: string): string[] {
    return Object.values(PERMISSIONS)
      .filter(permission => permission.resource === resource)
      .map(permission => permission.action);
  }
}

export default RBAC;