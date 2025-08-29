import { toast as sonnerToast } from 'sonner'

export const showToast = {
  success: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }): string | number => {
    return sonnerToast.success(message, {
      description: options?.description,
      action: options?.action
    })
  },

  error: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }): string | number => {
    return sonnerToast.error(message, {
      description: options?.description,
      action: options?.action
    })
  },

  info: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }): string | number => {
    return sonnerToast.info(message, {
      description: options?.description,
      action: options?.action
    })
  },

  warning: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }): string | number => {
    return sonnerToast.warning(message, {
      description: options?.description,
      action: options?.action
    })
  },

  loading: (message: string, options?: { description?: string }): string | number => {
    return sonnerToast.loading(message, {
      description: options?.description
    })
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: { description?: string }
  ): string | number => {
    return sonnerToast.promise(promise, messages, options)
  },

  custom: (jsx: React.ReactNode, options?: { duration?: number; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' }): string | number => {
    return sonnerToast.custom(jsx, options)
  },

  dismiss: (id?: string | number): void => {
    return sonnerToast.dismiss(id)
  },

  dismissAll: () => {
    return toast.dismiss()
  }
}

// Convenience aliases
export { showToast as toast }