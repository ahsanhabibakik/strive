"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Global error:", error);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service (Sentry, Bugsnag, etc.)
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-2xs border p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.05 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Error</h1>

            <p className="text-gray-600 mb-6">
              A critical error occurred. Our team has been notified and is working to fix this
              issue.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-gray-50 rounded-sm p-4 mb-4">
                <summary className="font-semibold cursor-pointer">Error Details (Dev Only)</summary>
                <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                  {error.toString()}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
