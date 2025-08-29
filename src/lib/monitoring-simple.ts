import { ErrorLogger } from './sentry';

/**
 * Simple system health monitoring without circular dependencies
 */
export class SystemMonitor {
  private static healthChecks: Map<string, () => Promise<boolean>> = new Map();
  
  /**
   * Register a health check
   */
  static registerHealthCheck(name: string, check: () => Promise<boolean>) {
    this.healthChecks.set(name, check);
  }
  
  /**
   * Run all health checks
   */
  static async runHealthChecks(): Promise<{
    status: 'healthy' | 'unhealthy';
    checks: Record<string, { status: 'pass' | 'fail'; error?: string; responseTime: number }>;
  }> {
    const results: Record<string, { status: 'pass' | 'fail'; error?: string; responseTime: number }> = {};
    let overallHealthy = true;
    
    for (const [name, check] of this.healthChecks) {
      const startTime = Date.now();
      
      try {
        const result = await check();
        results[name] = {
          status: result ? 'pass' : 'fail',
          responseTime: Date.now() - startTime,
        };
        
        if (!result) {
          overallHealthy = false;
        }
      } catch (error) {
        results[name] = {
          status: 'fail',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        };
        overallHealthy = false;
        
        ErrorLogger.logError(
          error instanceof Error ? error : new Error(String(error)),
          { healthCheck: name },
          { component: 'health-check' }
        );
      }
    }
    
    return {
      status: overallHealthy ? 'healthy' : 'unhealthy',
      checks: results,
    };
  }
}

/**
 * Database monitoring
 */
export class DatabaseMonitor {
  /**
   * Check database connection health
   */
  static async checkDatabaseHealth(): Promise<boolean> {
    try {
      const mongoose = await import('mongoose');
      return mongoose.connection.readyState === 1;
    } catch (error) {
      return false;
    }
  }
}

// Register default health checks
SystemMonitor.registerHealthCheck('database', DatabaseMonitor.checkDatabaseHealth);

SystemMonitor.registerHealthCheck('memory', async () => {
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
  return memoryUsageMB < 1000; // Fail if above 1GB
});

SystemMonitor.registerHealthCheck('basic', async () => {
  // Basic health check - always passes
  return true;
});

