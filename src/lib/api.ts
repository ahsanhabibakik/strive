/**
 * API utility functions for making HTTP requests
 */

import { withMonitoring } from './monitoring';

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

/**
 * Create an API error with status and data
 */
export function createApiError(
  message: string, 
  status?: number, 
  data?: any
): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.data = data;
  return error;
}

/**
 * Base fetch wrapper with monitoring and error handling
 */
async function baseFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    
    throw createApiError(
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as unknown as T;
}

/**
 * GET request
 */
export const apiGet = withMonitoring(
  async <T>(url: string, options?: RequestInit): Promise<T> => {
    return baseFetch<T>(url, { method: 'GET', ...options });
  },
  'api.get'
);

/**
 * POST request
 */
export const apiPost = withMonitoring(
  async <T>(url: string, data?: any, options?: RequestInit): Promise<T> => {
    return baseFetch<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },
  'api.post'
);

/**
 * PUT request
 */
export const apiPut = withMonitoring(
  async <T>(url: string, data?: any, options?: RequestInit): Promise<T> => {
    return baseFetch<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },
  'api.put'
);

/**
 * PATCH request
 */
export const apiPatch = withMonitoring(
  async <T>(url: string, data?: any, options?: RequestInit): Promise<T> => {
    return baseFetch<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },
  'api.patch'
);

/**
 * DELETE request
 */
export const apiDelete = withMonitoring(
  async <T>(url: string, options?: RequestInit): Promise<T> => {
    return baseFetch<T>(url, { method: 'DELETE', ...options });
  },
  'api.delete'
);

/**
 * Upload file
 */
export const apiUpload = withMonitoring(
  async <T>(url: string, formData: FormData, options?: RequestInit): Promise<T> => {
    const config = {
      method: 'POST',
      body: formData,
      ...options,
    };
    
    // Remove Content-Type header to let browser set it with boundary
    if (config.headers) {
      delete (config.headers as any)['Content-Type'];
    }

    return baseFetch<T>(url, config);
  },
  'api.upload'
);

/**
 * API client class for structured API interactions
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '', headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
  }

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private getOptions(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiGet<T>(this.getUrl(endpoint), this.getOptions(options));
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return apiPost<T>(this.getUrl(endpoint), data, this.getOptions(options));
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return apiPut<T>(this.getUrl(endpoint), data, this.getOptions(options));
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return apiPatch<T>(this.getUrl(endpoint), data, this.getOptions(options));
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiDelete<T>(this.getUrl(endpoint), this.getOptions(options));
  }

  async upload<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    return apiUpload<T>(this.getUrl(endpoint), formData, this.getOptions(options));
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient('/api');