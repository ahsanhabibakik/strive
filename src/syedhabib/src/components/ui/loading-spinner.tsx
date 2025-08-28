'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          'border-t-primary animate-spin rounded-full border-muted',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="flex justify-center items-center py-10 w-full">
      <LoadingSpinner size="md" />
    </div>
  );
}

export function LoadingInline() {
  return <LoadingSpinner size="sm" className="inline-block ml-2" />;
}