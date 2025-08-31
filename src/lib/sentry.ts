/**
 * Simplified error logger for development (Sentry disabled)
 */
export class ErrorLogger {
  /**
   * Log an error with additional context
   */
  static logError(error: Error, context?: Record<string, any>, tags?: Record<string, string>) {
    console.error('Error logged:', error.message, context);

    // Sentry disabled for dev speed
    // Sentry.withScope((scope) => {
    //   if (context) {
    //     Object.entries(context).forEach(([key, value]) => {
    //       scope.setContext(key, value);
    //     });
    //   }
    //   if (tags) {
    //     Object.entries(tags).forEach(([key, value]) => {
    //       scope.setTag(key, value);
    //     });
    //   }
    //   Sentry.captureException(error);
    // });
  }

  /**
   * Log a message with level
   */
  static logMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', extra?: any) {
    console[level === 'warning' ? 'warn' : level](message, extra);

    // Sentry disabled for dev speed
    // Sentry.withScope((scope) => {
    //   if (extra) {
    //     scope.setExtra('data', extra);
    //   }
    //   Sentry.captureMessage(message, level);
    // });
  }

  /**
   * Set user context for error tracking
   */
  static setUser(user: { id: string; email?: string; username?: string }) {
    // Sentry disabled for dev speed
    // Sentry.setUser({ id: user.id, email: user.email, username: user.username });
  }

  /**
   * Clear user context
   */
  static clearUser() {
    // Sentry disabled for dev speed
    // Sentry.setUser(null);
  }

  /**
   * Add breadcrumb for tracking user actions
   */
  static addBreadcrumb(message: string, category: string, data?: any) {
    // Sentry disabled for dev speed
    // Sentry.addBreadcrumb({ message, category, data, level: 'info', timestamp: Date.now() / 1000 });
  }
}

/**
 * Wrapper for API routes to catch and log unhandled errors
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      ErrorLogger.logError(
        error instanceof Error ? error : new Error(String(error)),
        { context, args: args.slice(0, 2) }, // Limit args to prevent sensitive data
        { handler: context || 'unknown' }
      );
      throw error;
    }
  };
}

/**
 * Performance monitoring helpers
 */
export class PerformanceMonitor {
  /**
   * Start a performance transaction
   */
  static startTransaction(name: string, op: string) {
    // Sentry disabled for dev speed
    return { finish: () => {} };
  }

  /**
   * Create a span within a transaction
   */
  static startSpan(description: string, op: string, parentTransaction?: any) {
    // Sentry disabled for dev speed
    return { finish: () => {} };
  }

  /**
   * Time a function execution
   */
  static async timeFunction<T>(
    name: string,
    fn: () => Promise<T>,
    op: string = 'function'
  ): Promise<T> {
    // Sentry disabled for dev speed
    return await fn();
  }
}

export default ErrorLogger;