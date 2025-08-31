"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLoading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = "/auth/signin",
  requireAuth = true,
  allowedRoles = [],
  requireEmailVerification = false,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // If authentication is not required, allow access
    if (!requireAuth) {
      setIsAuthorized(true);
      return;
    }

    // If not authenticated and auth is required
    if (!session) {
      setIsAuthorized(false);
      if (redirectTo) {
        router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
    }

    if (session?.user) {
      const user = session.user as any;

      // Check email verification if required
      if (requireEmailVerification && !user.emailVerified) {
        setIsAuthorized(false);
        router.push("/auth/verify-email");
        return;
      }

      // Check role permissions
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    }
  }, [session, status, requireAuth, allowedRoles, requireEmailVerification, redirectTo, router]);

  // Loading state
  if (status === "loading" || isAuthorized === null) {
    return <PageLoading message="Checking authentication..." />;
  }

  // Not authorized
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default unauthorized UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xs border p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>

          <p className="text-gray-600 mb-6">
            {!session
              ? "You need to sign in to access this page."
              : allowedRoles.length > 0
                ? "You don't have permission to access this page."
                : "Your account needs verification to continue."}
          </p>

          <div className="space-y-3">
            {!session ? (
              <Button asChild className="w-full">
                <Link
                  href={`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`}
                >
                  Sign In
                </Link>
              </Button>
            ) : allowedRoles.length > 0 ? (
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth/verify-email">Verify Email</Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component wrapper
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  protection: Omit<ProtectedRouteProps, "children">
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...protection}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Convenience components for common patterns
export const AdminRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <ProtectedRoute allowedRoles={["admin"]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const ModeratorRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ProtectedRoute allowedRoles={["admin", "moderator"]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ProtectedRoute requireAuth={true} fallback={fallback}>
    {children}
  </ProtectedRoute>
);
