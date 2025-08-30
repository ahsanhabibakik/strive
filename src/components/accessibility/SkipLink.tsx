"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Base styles
        "fixed top-4 left-4 z-50 px-4 py-2 text-sm font-medium",
        "bg-blue-600 text-white rounded-md shadow-lg",
        "focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "transition-transform duration-200 ease-in-out",
        // Hidden by default, visible on focus
        "transform -translate-y-full opacity-0",
        "focus:translate-y-0 focus:opacity-100",
        className
      )}
    >
      {children}
    </a>
  );
}

export default SkipLink;
