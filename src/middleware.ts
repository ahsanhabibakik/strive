import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { applySecurityHeaders } from '@/lib/security/headers'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/goals',
  '/habits',
  '/profile',
  '/settings',
  '/api/goals',
  '/api/habits',
  '/api/users',
]

// Routes that require admin access
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Routes that require moderator or admin access
const moderatorRoutes = [
  '/moderate',
  '/api/moderate',
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/support',
  '/blog',
  '/auth',
  '/terms',
  '/privacy',
  '/cookies',
]

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route))
}

function isModeratorRoute(pathname: string): boolean {
  return moderatorRoutes.some(route => pathname.startsWith(route))
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // Allow access to public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      // Allow public API routes
      if (pathname.startsWith('/api/auth/') || 
          pathname.startsWith('/api/public/') ||
          pathname === '/api/health') {
        return NextResponse.next()
      }

      // Check authentication for protected API routes
      if (isProtectedRoute(pathname) && !token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check admin access for admin API routes
      if (isAdminRoute(pathname)) {
        if (!token || (token as any).role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        }
      }

      // Check moderator access for moderator API routes
      if (isModeratorRoute(pathname)) {
        if (!token || !['admin', 'moderator'].includes((token as any).role)) {
          return NextResponse.json(
            { error: 'Moderator access required' },
            { status: 403 }
          )
        }
      }

      return NextResponse.next()
    }

    // Handle page routes
    if (isProtectedRoute(pathname)) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(signInUrl)
      }

      // Check email verification for protected routes
      if (!(token as any).emailVerified && pathname !== '/auth/verify-email') {
        return NextResponse.redirect(new URL('/auth/verify-email', req.url))
      }
    }

    // Check admin access for admin pages
    if (isAdminRoute(pathname)) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(signInUrl)
      }

      if ((token as any).role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Check moderator access for moderator pages
    if (isModeratorRoute(pathname)) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(signInUrl)
      }

      if (!['admin', 'moderator'].includes((token as any).role)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/') && token && pathname !== '/auth/verify-email') {
      // If user needs email verification, redirect to verify page
      if (!(token as any).emailVerified) {
        return NextResponse.redirect(new URL('/auth/verify-email', req.url))
      }
      
      // Otherwise redirect to dashboard
      const callbackUrl = req.nextUrl.searchParams.get('callbackUrl')
      const redirectUrl = callbackUrl || '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    const response = NextResponse.next()
    return applySecurityHeaders(response, request)
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle authorization
    },
  }
)

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}