'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We apologize for the inconvenience. The application encountered a critical error.
            </p>
            <Button onClick={reset} variant="default">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}