import { env } from '@/lib/config/env'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  error?: Error
  userId?: string
  requestId?: string
  ip?: string
  userAgent?: string
}

export interface ILogger {
  error(message: string, context?: Record<string, any>, error?: Error): void
  warn(message: string, context?: Record<string, any>): void
  info(message: string, context?: Record<string, any>): void
  debug(message: string, context?: Record<string, any>): void
}

class Logger implements ILogger {
  private level: LogLevel
  private context: Record<string, any> = {}

  constructor(level?: LogLevel) {
    this.level = level ?? this.getLogLevelFromEnv()
  }

  private getLogLevelFromEnv(): LogLevel {
    switch (env.LOG_LEVEL) {
      case 'error':
        return LogLevel.ERROR
      case 'warn':
        return LogLevel.WARN
      case 'info':
        return LogLevel.INFO
      case 'debug':
        return LogLevel.DEBUG
      default:
        return LogLevel.INFO
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): string {
    const timestamp = new Date().toISOString()
    const levelName = LogLevel[level]
    
    let logMessage = `[${timestamp}] [${levelName}] ${message}`
    
    if (context && Object.keys(context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(context)}`
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`
      if (error.stack) {
        logMessage += `\nStack: ${error.stack}`
      }
    }
    
    return logMessage
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const fullContext = { ...this.context, ...context }
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: fullContext,
      error,
    }

    const formattedMessage = this.formatMessage(level, message, fullContext, error)

    // Console output with colors in development
    if (env.NODE_ENV === 'development') {
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[36m',  // Cyan
        [LogLevel.DEBUG]: '\x1b[37m', // White
      }
      const reset = '\x1b[0m'
      console.log(`${colors[level]}${formattedMessage}${reset}`)
    } else {
      // Production logging
      console.log(formattedMessage)
      
      // In production, also send to external logging service
      this.sendToExternalService(logEntry)
    }
  }

  private async sendToExternalService(logEntry: LogEntry): Promise<void> {
    try {
      // Send to external logging service (e.g., Sentry, LogRocket, etc.)
      if (env.SENTRY_DSN && logEntry.level === LogLevel.ERROR) {
        // Example: Send to Sentry
        // Sentry.captureException(logEntry.error || new Error(logEntry.message), {
        //   contexts: { logEntry }
        // })
      }

      // Could also send to other services like:
      // - Datadog
      // - New Relic
      // - CloudWatch
      // - Custom logging endpoint
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context }
  }

  clearContext(): void {
    this.context = {}
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.level)
    childLogger.context = { ...this.context, ...context }
    return childLogger
  }
}

// Singleton logger instance
export const logger = new Logger()

// Utility functions for common logging patterns
export const loggerUtils = {
  // API request logging
  logApiRequest: (method: string, url: string, userId?: string, duration?: number) => {
    logger.info(`API Request: ${method} ${url}`, {
      method,
      url,
      userId,
      duration,
      type: 'api_request'
    })
  },

  // API error logging
  logApiError: (method: string, url: string, error: Error, userId?: string, statusCode?: number) => {
    logger.error(`API Error: ${method} ${url}`, {
      method,
      url,
      userId,
      statusCode,
      type: 'api_error'
    }, error)
  },

  // User action logging
  logUserAction: (action: string, userId: string, resourceId?: string, details?: Record<string, any>) => {
    logger.info(`User Action: ${action}`, {
      action,
      userId,
      resourceId,
      ...details,
      type: 'user_action'
    })
  },

  // Performance logging
  logPerformance: (operation: string, duration: number, details?: Record<string, any>) => {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO
    const message = `Performance: ${operation} took ${duration}ms`
    
    if (level === LogLevel.WARN) {
      logger.warn(message, { operation, duration, ...details, type: 'performance' })
    } else {
      logger.info(message, { operation, duration, ...details, type: 'performance' })
    }
  },

  // Database query logging
  logDbQuery: (query: string, duration: number, collection?: string, userId?: string) => {
    logger.debug('Database Query', {
      query,
      duration,
      collection,
      userId,
      type: 'db_query'
    })
  },

  // Authentication logging
  logAuth: (event: string, userId?: string, email?: string, ip?: string) => {
    logger.info(`Auth: ${event}`, {
      event,
      userId,
      email,
      ip,
      type: 'auth'
    })
  },

  // Security event logging
  logSecurity: (event: string, userId?: string, ip?: string, details?: Record<string, any>) => {
    logger.warn(`Security: ${event}`, {
      event,
      userId,
      ip,
      ...details,
      type: 'security'
    })
  },
}

// Request correlation ID middleware helper
export function withRequestId(requestId: string): Logger {
  return logger.child({ requestId })
}

// User context helper
export function withUser(userId: string, email?: string): Logger {
  return logger.child({ userId, email })
}

// Export default logger
export default logger