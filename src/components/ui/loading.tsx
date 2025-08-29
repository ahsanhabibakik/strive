import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};

interface LoadingBarProps {
  progress?: number;
  className?: string;
  showPercentage?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  className,
  showPercentage = false,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: progress ? `${progress}%` : "0%" }}
        />
      </div>
      {showPercentage && progress !== undefined && (
        <div className="text-sm text-gray-600 mt-1 text-center">{Math.round(progress)}%</div>
      )}
    </div>
  );
};

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message = "Loading...", className }) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}
    >
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  loadingText,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <LoadingSpinner size="sm" />
        <span>{loadingText || "Loading..."}</span>
      </div>
    );
  }

  return <>{children}</>;
};

interface OverlayLoadingProps {
  show: boolean;
  message?: string;
  backdrop?: boolean;
}

export const OverlayLoading: React.FC<OverlayLoadingProps> = ({
  show,
  message = "Loading...",
  backdrop = true,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {backdrop && <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />}
      <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

const LoadingComponents = {
  Spinner: LoadingSpinner,
  Dots: LoadingDots,
  Bar: LoadingBar,
  Page: PageLoading,
  Button: ButtonLoading,
  Overlay: OverlayLoading,
};

export default LoadingComponents;
