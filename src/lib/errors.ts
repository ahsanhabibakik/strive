import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './monitoring';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, true, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, true, 'DATABASE_ERROR');
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `${service} service unavailable`, 503, true, 'EXTERNAL_SERVICE_ERROR');
  }
}

/**
 * Handle and format different types of errors
 */
export function handleError(error: Error): {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
} {
  // Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    return {
      message: 'Validation failed',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details
    };
  }

  // MongoDB duplicate key error
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0] || 'field';
    return {
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      statusCode: 409,
      code: 'DUPLICATE_ERROR'
    };
  }

  // MongoDB cast error
  if (error.name === 'CastError') {
    return {
      message: 'Invalid ID format',
      statusCode: 400,
      code: 'INVALID_ID_ERROR'
    };
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return {
      message: 'Invalid token',
      statusCode: 401,
      code: 'INVALID_TOKEN_ERROR'
    };
  }

  if (error.name === 'TokenExpiredError') {
    return {
      message: 'Token expired',
      statusCode: 401,
      code: 'TOKEN_EXPIRED_ERROR'
    };
  }

  // Our custom app errors
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      details: error.details
    };
  }

  // Default error
  return {
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    statusCode: 500,
    code: 'INTERNAL_ERROR'
  };
}

/**
 * Create standardized API responses
 */
export function createApiResponse<T>(
  data?: T,
  message?: string,
  meta?: any
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta
  });
}

export function createErrorResponse(
  error: Error | string,
  statusCode?: number
): NextResponse {
  const errorObj = typeof error === 'string' 
    ? new AppError(error, statusCode || 500)
    : error;

  const errorInfo = handleError(errorObj);

  // Log error for monitoring
  logger.error('API Error', errorObj, {
    statusCode: errorInfo.statusCode,
    code: errorInfo.code
  });

  return NextResponse.json(
    {
      success: false,
      error: errorInfo.message,
      code: errorInfo.code,
      details: errorInfo.details
    },
    { status: errorInfo.statusCode }
  );
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler(
  handler: (request: any, context?: any) => Promise<NextResponse>
) {
  return async (request: any, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error as Error);
    }
  };
}

/**
 * Try-catch wrapper for async operations
 */
export async function tryCatch<T>(
  operation: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    return [null, error as Error];
  }
}

/**
 * Assert function for validating conditions
 */
export function assert(condition: boolean, error: Error | string): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new AppError(error);
    }
    throw error;
  }
}

/**
 * Type guard for checking if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(str: string): [T | null, Error | null] {
  try {
    const parsed = JSON.parse(str);
    return [parsed, null];
  } catch (error) {
    return [null, error as Error];
  }
}

/**
 * Format error message for user-friendly display
 */
export function formatErrorMessage(error: Error): string {
  if (error instanceof ValidationError && error.details) {
    return error.details
      .map((detail: any) => detail.message)
      .join(', ');
  }
  
  return error.message;
}

/**
 * Create pagination meta object
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
}