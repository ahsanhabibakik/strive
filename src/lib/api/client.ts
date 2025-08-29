import { toast } from '@/lib/utils/toast'

export interface ApiError extends Error {
  status?: number
  data?: any
  code?: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryCondition?: (error: ApiError) => boolean
}

export interface RequestConfig extends RequestInit {
  retry?: Partial<RetryConfig>
  showToast?: boolean
  timeout?: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  retryCondition: (error) => {
    // Retry on network errors, 5xx errors, and specific 4xx errors
    return !error.status || 
           error.status >= 500 || 
           error.status === 408 || 
           error.status === 429
  }
}

export function createApiError(
  message: string,
  status?: number,
  data?: any,
  code?: string
): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.data = data
  error.code = code
  return error
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.baseDelay * Math.pow(2, attempt - 1)
  const jitter = Math.random() * 0.1 * exponentialDelay
  return Math.min(exponentialDelay + jitter, config.maxDelay)
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ])
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private defaultConfig: RequestConfig

  constructor(
    baseUrl: string = '/api',
    headers: Record<string, string> = {},
    config: Partial<RequestConfig> = {}
  ) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }
    this.defaultConfig = {
      timeout: 30000,
      showToast: true,
      retry: DEFAULT_RETRY_CONFIG,
      ...config
    }
  }

  private getUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${this.baseUrl}${cleanEndpoint}`
  }

  private async executeRequest<T>(
    url: string,
    options: RequestConfig
  ): Promise<T> {
    const config = {
      ...this.defaultConfig,
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    }

    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retry }
    let lastError: ApiError

    for (let attempt = 1; attempt <= retryConfig.maxRetries + 1; attempt++) {
      try {
        const fetchPromise = fetch(url, config)
        const response = config.timeout
          ? await withTimeout(fetchPromise, config.timeout)
          : await fetchPromise

        if (!response.ok) {
          let errorData: any
          let errorMessage: string

          try {
            errorData = await response.json()
            errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`
          } catch {
            const textData = await response.text()
            errorMessage = textData || `HTTP ${response.status}: ${response.statusText}`
            errorData = { text: textData }
          }

          const apiError = createApiError(
            errorMessage,
            response.status,
            errorData,
            errorData?.code
          )

          if (attempt > retryConfig.maxRetries || !retryConfig.retryCondition?.(apiError)) {
            if (config.showToast) {
              toast.error('Request failed', { description: errorMessage })
            }
            throw apiError
          }

          lastError = apiError
          const delayMs = calculateBackoffDelay(attempt, retryConfig)
          await delay(delayMs)
          continue
        }

        const contentType = response.headers.get('content-type')
        let result: T

        if (contentType?.includes('application/json')) {
          result = await response.json()
        } else {
          result = await response.text() as unknown as T
        }

        return result

      } catch (error) {
        const apiError = error instanceof Error
          ? createApiError(error.message, undefined, undefined, 'NETWORK_ERROR')
          : createApiError('Unknown error occurred')

        if (attempt > retryConfig.maxRetries || !retryConfig.retryCondition?.(apiError)) {
          if (config.showToast) {
            toast.error('Network error', { description: apiError.message })
          }
          throw apiError
        }

        lastError = apiError
        const delayMs = calculateBackoffDelay(attempt, retryConfig)
        await delay(delayMs)
      }
    }

    throw lastError!
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>(this.getUrl(endpoint), {
      method: 'GET',
      ...config
    })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>(this.getUrl(endpoint), {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>(this.getUrl(endpoint), {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    })
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>(this.getUrl(endpoint), {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>(this.getUrl(endpoint), {
      method: 'DELETE',
      ...config
    })
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T> {
    const uploadConfig = {
      method: 'POST',
      body: formData,
      ...config,
      headers: {
        // Remove Content-Type to let browser set boundary
        ...config?.headers
      }
    }

    // Remove Content-Type header for file uploads
    if (uploadConfig.headers && 'Content-Type' in uploadConfig.headers) {
      delete uploadConfig.headers['Content-Type']
    }

    return this.executeRequest<T>(this.getUrl(endpoint), uploadConfig)
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization']
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key]
  }
}

// Create default client instance
export const apiClient = new ApiClient()

// Utility functions for quick API calls
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  upload: <T>(endpoint: string, formData: FormData, config?: RequestConfig) => apiClient.upload<T>(endpoint, formData, config)
}