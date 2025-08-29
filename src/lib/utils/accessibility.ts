import { useEffect, useRef } from 'react'

// WCAG 2.1 AA Compliance Utilities

export interface AccessibilityConfig {
  announcePageChanges?: boolean
  trapFocus?: boolean
  enableHighContrast?: boolean
  respectReducedMotion?: boolean
  enableKeyboardNavigation?: boolean
}

// Focus management utilities
export const focusUtils = {
  // Trap focus within a container for modals, dialogs
  trapFocus: (containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      }
      
      // ESC key to close modals
      if (e.key === 'Escape') {
        const closeButton = containerElement.querySelector('[data-close-modal]') as HTMLElement
        if (closeButton) {
          closeButton.click()
        }
      }
    }

    containerElement.addEventListener('keydown', handleKeyDown)
    firstFocusable?.focus()

    return () => {
      containerElement.removeEventListener('keydown', handleKeyDown)
    }
  },

  // Set focus to element with announcement
  setFocusWithAnnouncement: (element: HTMLElement, message?: string) => {
    element.focus()
    if (message) {
      announceToScreenReader(message)
    }
  },

  // Get next focusable element
  getNextFocusable: (currentElement: HTMLElement, direction: 'next' | 'prev' = 'next'): HTMLElement | null => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const currentIndex = focusableElements.indexOf(currentElement)
    
    if (direction === 'next') {
      return focusableElements[currentIndex + 1] || focusableElements[0]
    } else {
      return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1]
    }
  }
}

// Screen reader announcement utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', priority)
  announcer.setAttribute('aria-atomic', 'true')
  announcer.className = 'sr-only'
  announcer.textContent = message
  
  document.body.appendChild(announcer)
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer)
  }, 1000)
}

// Color contrast utilities
export const colorUtils = {
  // Check if color meets WCAG AA contrast ratio (4.5:1)
  meetsContrastRatio: (foreground: string, background: string): boolean => {
    const getLuminance = (color: string): number => {
      // Convert hex to RGB
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      // Calculate relative luminance
      const getRGB = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      
      return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b)
    }
    
    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return contrast >= 4.5 // WCAG AA standard
  },

  // Get high contrast alternative color
  getHighContrastColor: (baseColor: string): string => {
    const luminance = colorUtils.meetsContrastRatio(baseColor, '#FFFFFF')
    return luminance ? '#000000' : '#FFFFFF'
  }
}

// Motion preferences
export const motionUtils = {
  // Respect user's motion preferences
  respectsReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Get safe animation duration based on user preferences
  getSafeAnimationDuration: (defaultDuration: number): number => {
    return motionUtils.respectsReducedMotion() ? 0 : defaultDuration
  },

  // Apply animation only if user allows it
  conditionalAnimation: <T extends Record<string, any>>(
    animation: T,
    fallback: T = {} as T
  ): T => {
    return motionUtils.respectsReducedMotion() ? fallback : animation
  }
}

// Keyboard navigation utilities
export const keyboardUtils = {
  // Handle arrow key navigation for lists
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (newIndex: number) => void
  ) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        onIndexChange(currentIndex < items.length - 1 ? currentIndex + 1 : 0)
        break
      case 'ArrowUp':
        event.preventDefault()
        onIndexChange(currentIndex > 0 ? currentIndex - 1 : items.length - 1)
        break
      case 'Home':
        event.preventDefault()
        onIndexChange(0)
        break
      case 'End':
        event.preventDefault()
        onIndexChange(items.length - 1)
        break
    }
  },

  // Handle keyboard activation (Enter, Space)
  isActivationKey: (key: string): boolean => {
    return key === 'Enter' || key === ' '
  }
}

// React hooks for accessibility
export const useAccessibility = (config: AccessibilityConfig = {}) => {
  const {
    announcePageChanges = true,
    trapFocus = false,
    enableHighContrast = false,
    respectReducedMotion = true
  } = config

  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (announcePageChanges) {
      const handleRouteChange = () => {
        announceToScreenReader('Page loaded', 'assertive')
      }
      
      // Announce page changes after navigation
      setTimeout(handleRouteChange, 100)
    }
  }, [announcePageChanges])

  useEffect(() => {
    if (trapFocus && containerRef.current) {
      return focusUtils.trapFocus(containerRef.current)
    }
  }, [trapFocus])

  useEffect(() => {
    if (enableHighContrast) {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)')
      const handleContrastChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('high-contrast', e.matches)
      }
      
      mediaQuery.addEventListener('change', handleContrastChange)
      document.documentElement.classList.toggle('high-contrast', mediaQuery.matches)
      
      return () => mediaQuery.removeEventListener('change', handleContrastChange)
    }
  }, [enableHighContrast])

  useEffect(() => {
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const handleMotionChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('reduce-motion', e.matches)
      }
      
      mediaQuery.addEventListener('change', handleMotionChange)
      document.documentElement.classList.toggle('reduce-motion', mediaQuery.matches)
      
      return () => mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [respectReducedMotion])

  return {
    containerRef,
    announceToScreenReader,
    focusUtils,
    colorUtils,
    motionUtils,
    keyboardUtils
  }
}

// ARIA utilities
export const ariaUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Create describedby relationship
  createDescription: (element: HTMLElement, description: string): string => {
    const id = ariaUtils.generateId('description')
    const descElement = document.createElement('div')
    descElement.id = id
    descElement.className = 'sr-only'
    descElement.textContent = description
    
    element.parentNode?.insertBefore(descElement, element.nextSibling)
    element.setAttribute('aria-describedby', id)
    
    return id
  },

  // Create labelledby relationship
  createLabel: (element: HTMLElement, labelText: string): string => {
    const id = ariaUtils.generateId('label')
    const labelElement = document.createElement('label')
    labelElement.id = id
    labelElement.className = 'sr-only'
    labelElement.textContent = labelText
    
    element.parentNode?.insertBefore(labelElement, element)
    element.setAttribute('aria-labelledby', id)
    
    return id
  }
}

// Form accessibility utilities
export const formUtils = {
  // Validate form accessibility
  validateFormAccessibility: (form: HTMLFormElement): string[] => {
    const issues: string[] = []
    
    // Check for labels
    const inputs = form.querySelectorAll('input, select, textarea')
    inputs.forEach((input, index) => {
      const hasLabel = input.hasAttribute('aria-label') || 
                      input.hasAttribute('aria-labelledby') ||
                      form.querySelector(`label[for="${input.id}"]`)
      
      if (!hasLabel) {
        issues.push(`Input at index ${index} is missing a label`)
      }
    })
    
    // Check for error messages
    const errorElements = form.querySelectorAll('[aria-invalid="true"]')
    errorElements.forEach((element, index) => {
      const hasErrorMessage = element.hasAttribute('aria-describedby')
      if (!hasErrorMessage) {
        issues.push(`Invalid input at index ${index} is missing error description`)
      }
    })
    
    return issues
  },

  // Add error message to form field
  addErrorMessage: (field: HTMLElement, message: string): void => {
    const existingError = document.getElementById(`${field.id}-error`)
    if (existingError) {
      existingError.textContent = message
      return
    }
    
    const errorElement = document.createElement('div')
    errorElement.id = `${field.id}-error`
    errorElement.className = 'error-message text-red-600 text-sm mt-1'
    errorElement.setAttribute('role', 'alert')
    errorElement.textContent = message
    
    field.parentNode?.insertBefore(errorElement, field.nextSibling)
    field.setAttribute('aria-describedby', errorElement.id)
    field.setAttribute('aria-invalid', 'true')
  },

  // Remove error message from form field
  removeErrorMessage: (field: HTMLElement): void => {
    const errorElement = document.getElementById(`${field.id}-error`)
    if (errorElement) {
      errorElement.remove()
    }
    
    field.removeAttribute('aria-describedby')
    field.removeAttribute('aria-invalid')
  }
}

const accessibilityUtils = {
  focusUtils,
  colorUtils,
  motionUtils,
  keyboardUtils,
  ariaUtils,
  formUtils,
  useAccessibility,
  announceToScreenReader
}

export default accessibilityUtils