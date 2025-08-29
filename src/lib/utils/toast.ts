import { toast } from 'sonner'

export const showToast = {
  success: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
    return toast.success(message, {
      description: options?.description,
      action: options?.action
    })
  },

  error: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
    return toast.error(message, {
      description: options?.description,
      action: options?.action
    })
  },

  info: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
    return toast.info(message, {
      description: options?.description,
      action: options?.action
    })
  },

  warning: (message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) => {
    return toast.warning(message, {
      description: options?.description,
      action: options?.action
    })
  },

  loading: (message: string, options?: { description?: string }) => {
    return toast.loading(message, {
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
  ) => {
    return toast.promise(promise, messages, options)
  },

  custom: (jsx: React.ReactNode, options?: { duration?: number; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' }) => {
    return toast.custom(jsx, options)
  },

  dismiss: (id?: string | number) => {
    return toast.dismiss(id)
  },

  dismissAll: () => {
    return toast.dismiss()
  }
}

// Convenience aliases
export const toast = showToast