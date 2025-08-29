'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
  emailVerified?: boolean
  isActive?: boolean
  createdAt?: Date
  lastLoginAt?: Date
}

export interface AuthState {
  user: User | null
  session: any
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isModerator: boolean
  canAccess: (roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  isEmailVerified: boolean
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession()

  const authState = useMemo(() => {
    const isLoading = status === 'loading'
    const isAuthenticated = !!session?.user && status === 'authenticated'
    const user = session?.user as User | null

    const isAdmin = user?.role === 'admin'
    const isModerator = user?.role === 'moderator' || isAdmin
    const isEmailVerified = user?.emailVerified ?? false

    const canAccess = (roles: string[]): boolean => {
      if (!isAuthenticated || !user) return false
      return roles.includes(user.role)
    }

    const hasPermission = (permission: string): boolean => {
      if (!isAuthenticated || !user) return false
      
      // Admin has all permissions
      if (user.role === 'admin') return true
      
      // Define role-based permissions
      const rolePermissions: Record<string, string[]> = {
        admin: ['*'], // All permissions
        moderator: [
          'goals.read',
          'goals.moderate',
          'users.read',
          'comments.moderate',
          'reports.handle'
        ],
        user: [
          'goals.create',
          'goals.read',
          'goals.update',
          'goals.delete',
          'profile.update',
          'comments.create'
        ]
      }

      const userPermissions = rolePermissions[user.role] || []
      return userPermissions.includes('*') || userPermissions.includes(permission)
    }

    return {
      user,
      session,
      isLoading,
      isAuthenticated,
      isAdmin,
      isModerator,
      canAccess,
      hasPermission,
      isEmailVerified,
    }
  }, [session, status])

  return authState
}

// Specific hooks for common auth checks
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return { loading: true, authenticated: false }
  return { loading: false, authenticated: isAuthenticated }
}

export const useRequireRole = (roles: string | string[]) => {
  const { canAccess, isLoading, isAuthenticated } = useAuth()
  const rolesArray = Array.isArray(roles) ? roles : [roles]
  
  if (isLoading) return { loading: true, authorized: false }
  if (!isAuthenticated) return { loading: false, authorized: false }
  
  return { loading: false, authorized: canAccess(rolesArray) }
}

export const useRequirePermission = (permission: string) => {
  const { hasPermission, isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) return { loading: true, authorized: false }
  if (!isAuthenticated) return { loading: false, authorized: false }
  
  return { loading: false, authorized: hasPermission(permission) }
}