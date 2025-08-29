/**
 * Application Monitoring and Error Tracking
 */

import { ErrorLogger } from './sentry';

// Error tracking and logging
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
  }
  
  info(message: string, data?: any) {
    const entry = this.formatMessage('info', message, data);
    this.logs.push(entry);
    console.log(`[INFO] ${message}`, data || '');
  }
  
  warn(message: string, data?: any) {
    const entry = this.formatMessage('warning', message, data);
    this.logs.push(entry);
    console.warn(`[WARN] ${message}`, data || '');
  }
  
  error(message: string, error?: Error | any, data?: any) {
    const entry = this.formatMessage('error', message, { 
      error: error?.message || error,
      stack: error?.stack,
      ...data 
    });
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, error, data || '');
    
    // Send to Sentry in addition to local logging
    if (error instanceof Error) {
      ErrorLogger.logError(error, data, { source: 'logger' });
    } else {
      ErrorLogger.logMessage(message, 'error', { error, ...data });
    }
    
    // Send to monitoring service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(entry);
    }
  }
  
  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.formatMessage('debug', message, data);
      this.logs.push(entry);
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
  
  getLogs(): LogEntry[] {
    return this.logs.slice(-1000); // Keep last 1000 logs
  }
  
  clearLogs() {
    this.logs = [];
  }
  
  private async sendToMonitoring(entry: LogEntry) {
    try {
      await fetch('/api/monitoring/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Fail silently to avoid infinite loops
      console.error('Failed to send log to monitoring service:', error);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTimer(name: string): () => number {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        timestamp: new Date().toISOString(),
        type: 'timing',
      });
      return duration;
    };
  }
  
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Log slow operations
    if (metric.type === 'timing' && metric.value > 1000) {
      Logger.getInstance().warn(`Slow operation detected: ${metric.name}`, {
        duration: `${metric.value}ms`
      });
    }
    
    // Keep only recent metrics
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(-500);
    }
  }
  
  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }
  
  getAverageTime(name: string): number {
    const timingMetrics = this.metrics.filter(m => m.name === name && m.type === 'timing');
    if (timingMetrics.length === 0) return 0;
    
    const sum = timingMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / timingMetrics.length;
  }
}

// Error boundary for React components
export class ErrorBoundary {
  static handleError(error: Error, errorInfo?: any) {
    Logger.getInstance().error('React Error Boundary caught error', error, errorInfo);
    
    // Track error in analytics
    if (typeof window !== 'undefined') {
      import('./analytics').then(({ trackEvent }) => {
        trackEvent('React Error', {
          category: 'error',
          action: 'boundary_catch',
          label: error.message,
        });
      }).catch(() => {
        // Ignore analytics errors
      });
    }
  }
}

// API monitoring wrapper
export function withMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const monitor = PerformanceMonitor.getInstance();
    const logger = Logger.getInstance();
    const endTimer = monitor.startTimer(name);
    
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result && typeof result.then === 'function') {
        return result
          .then((data: any) => {
            endTimer();
            logger.debug(`API call successful: ${name}`);
            return data;
          })
          .catch((error: Error) => {
            endTimer();
            logger.error(`API call failed: ${name}`, error);
            throw error;
          });
      }
      
      endTimer();
      logger.debug(`Function call successful: ${name}`);
      return result;
    } catch (error) {
      endTimer();
      logger.error(`Function call failed: ${name}`, error as Error);
      throw error;
    }
  }) as T;
}

// System health monitoring
export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthStatus: HealthStatus = { status: 'unknown', checks: {} };
  
  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }
  
  async runHealthCheck(): Promise<HealthStatus> {
    const checks: Record<string, CheckResult> = {};
    
    // Check API availability
    checks.api = await this.checkAPI();
    
    // Check database connectivity
    checks.database = await this.checkDatabase();
    
    // Check performance
    checks.performance = await this.checkPerformance();
    
    // Determine overall status
    const hasError = Object.values(checks).some(check => check.status === 'error');
    const hasWarning = Object.values(checks).some(check => check.status === 'warning');
    
    const status = hasError ? 'error' : hasWarning ? 'warning' : 'healthy';
    
    this.healthStatus = {
      status,
      checks,
      timestamp: new Date().toISOString(),
    };
    
    return this.healthStatus;
  }
  
  private async checkAPI(): Promise<CheckResult> {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      return {
        status: response.ok ? 'healthy' : 'error',
        details: data.status || 'API responding',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        details: `API unavailable: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  private async checkDatabase(): Promise<CheckResult> {
    try {
      // This would be called from the server side
      const response = await fetch('/api/health/database');
      const data = await response.json();
      
      return {
        status: data.connected ? 'healthy' : 'error',
        details: data.details || 'Database connectivity',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        details: `Database check failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  private async checkPerformance(): Promise<CheckResult> {
    const monitor = PerformanceMonitor.getInstance();
    const metrics = monitor.getMetrics();
    
    // Check for recent slow operations
    const recentSlowOps = metrics.filter(
      m => m.type === 'timing' && 
          m.value > 2000 && 
          Date.now() - new Date(m.timestamp).getTime() < 300000 // last 5 minutes
    );
    
    if (recentSlowOps.length > 5) {
      return {
        status: 'warning',
        details: `${recentSlowOps.length} slow operations detected`,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      status: 'healthy',
      details: 'Performance within normal range',
      timestamp: new Date().toISOString(),
    };
  }
  
  getStatus(): HealthStatus {
    return this.healthStatus;
  }
}

// Types
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  url?: string;
  userAgent?: string;
}

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  type: 'timing' | 'counter' | 'gauge';
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  checks: Record<string, CheckResult>;
  timestamp?: string;
}

interface CheckResult {
  status: 'healthy' | 'warning' | 'error';
  details: string;
  timestamp: string;
}

// Export singleton instances
export const logger = Logger.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
export const healthMonitor = HealthMonitor.getInstance();

// Simple system monitor without circular dependencies  
export class SimpleSystemMonitor {
  static async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      // Basic health check without dependencies
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }
}