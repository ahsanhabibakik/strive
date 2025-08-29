'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { focusUtils } from '@/lib/utils/accessibility'

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  restoreFocus?: boolean
  className?: string
}

export function FocusTrap({ 
  children, 
  active = true, 
  restoreFocus = true,
  className 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    // Store the previously focused element
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
    }

    // Set up focus trap
    const cleanup = focusUtils.trapFocus(containerRef.current)

    return () => {
      cleanup()
      
      // Restore focus to previous element
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [active, restoreFocus])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default FocusTrap