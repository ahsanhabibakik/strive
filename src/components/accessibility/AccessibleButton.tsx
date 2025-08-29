'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    loadingText,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = [
      // Base button styles
      'inline-flex items-center justify-center rounded-md font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-all duration-200 ease-in-out',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // High contrast mode support
      'high-contrast:border-2 high-contrast:border-current'
    ]

    const variants = {
      primary: [
        'bg-blue-600 text-white hover:bg-blue-700',
        'focus:ring-blue-500',
        'high-contrast:bg-ButtonFace high-contrast:text-ButtonText'
      ],
      secondary: [
        'bg-gray-100 text-gray-900 hover:bg-gray-200',
        'focus:ring-gray-500',
        'high-contrast:bg-ButtonFace high-contrast:text-ButtonText'
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        'focus:ring-gray-500',
        'high-contrast:border-ButtonText'
      ],
      ghost: [
        'text-gray-700 hover:bg-gray-100',
        'focus:ring-gray-500',
        'high-contrast:text-ButtonText high-contrast:hover:bg-Highlight'
      ],
      destructive: [
        'bg-red-600 text-white hover:bg-red-700',
        'focus:ring-red-500',
        'high-contrast:bg-ButtonFace high-contrast:text-ButtonText'
      ]
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]'
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <>
            <Loader2 
              className="mr-2 h-4 w-4 animate-spin" 
              aria-hidden="true"
            />
            <span className="sr-only">Loading: </span>
          </>
        )}
        
        {loading && loadingText ? loadingText : children}
        
        {/* Screen reader indication for disabled state */}
        {isDisabled && !loading && (
          <span className="sr-only">, disabled</span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton