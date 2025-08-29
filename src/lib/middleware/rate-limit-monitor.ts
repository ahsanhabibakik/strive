import { NextRequest } from "next/server";
import { logger } from "../monitoring";
import { RateLimitResult } from "./rate-limit";

export interface RateLimitViolation {
  timestamp: Date;
  ip: string;
  userAgent: string;
  pathname: string;
  userId?: string;
  limit: number;
  used: number;
  resetTime: number;
  violationType: "ip" | "user" | "endpoint";
}

export interface RateLimitStats {
  totalRequests: number;
  violations: number;
  violationsByEndpoint: Record<string, number>;
  violationsByIP: Record<string, number>;
  violationsByUser: Record<string, number>;
  topViolators: Array<{ key: string; count: number; type: string }>;
}

// In-memory storage for rate limit monitoring
const violations: RateLimitViolation[] = [];
const stats: RateLimitStats = {
  totalRequests: 0,
  violations: 0,
  violationsByEndpoint: {},
  violationsByIP: {},
  violationsByUser: {},
  topViolators: [],
};

/**
 * Log a rate limit violation
 */
export function logRateLimitViolation(
  request: NextRequest,
  result: RateLimitResult,
  violationType: "ip" | "user" | "endpoint" = "ip",
  userId?: string
): void {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const pathname = request.nextUrl.pathname;

  const violation: RateLimitViolation = {
    timestamp: new Date(),
    ip,
    userAgent,
    pathname,
    userId,
    limit: result.limit,
    used: result.used,
    resetTime: result.resetTime,
    violationType,
  };

  // Store violation
  violations.push(violation);

  // Update statistics
  stats.totalRequests++;
  stats.violations++;

  // Track by endpoint
  stats.violationsByEndpoint[pathname] = (stats.violationsByEndpoint[pathname] || 0) + 1;

  // Track by IP
  stats.violationsByIP[ip] = (stats.violationsByIP[ip] || 0) + 1;

  // Track by user if available
  if (userId) {
    stats.violationsByUser[userId] = (stats.violationsByUser[userId] || 0) + 1;
  }

  // Log the violation
  logger.warn("Rate limit violation", {
    ip,
    pathname,
    userAgent: userAgent.substring(0, 200), // Truncate user agent
    userId,
    violationType,
    limit: result.limit,
    used: result.used,
    remaining: result.remaining,
    resetTime: new Date(result.resetTime).toISOString(),
  });

  // Check for suspicious patterns
  detectSuspiciousActivity(violation);

  // Cleanup old violations (keep only last 1000)
  if (violations.length > 1000) {
    violations.splice(0, violations.length - 1000);
  }
}

/**
 * Log successful request for monitoring
 */
export function logRateLimitSuccess(request: NextRequest, result: RateLimitResult): void {
  stats.totalRequests++;

  // Log high usage warnings
  const usagePercentage = (result.used / result.limit) * 100;

  if (usagePercentage > 80) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    logger.warn("High rate limit usage detected", {
      ip,
      pathname: request.nextUrl.pathname,
      usagePercentage: Math.round(usagePercentage),
      used: result.used,
      limit: result.limit,
      remaining: result.remaining,
    });
  }
}

/**
 * Detect suspicious activity patterns
 */
function detectSuspiciousActivity(violation: RateLimitViolation): void {
  const recentViolations = violations.filter(
    v => Date.now() - v.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
  );

  // Check for multiple violations from same IP
  const ipViolations = recentViolations.filter(v => v.ip === violation.ip);
  if (ipViolations.length >= 5) {
    logger.error("Potential attack detected - multiple violations from same IP", {
      ip: violation.ip,
      violations: ipViolations.length,
      endpoints: [...new Set(ipViolations.map(v => v.pathname))],
      timespan: "5 minutes",
    });
  }

  // Check for distributed attack (same user agent, different IPs)
  const userAgentViolations = recentViolations.filter(
    v => v.userAgent === violation.userAgent && v.userAgent !== "unknown"
  );
  if (userAgentViolations.length >= 5) {
    const uniqueIPs = new Set(userAgentViolations.map(v => v.ip));
    if (uniqueIPs.size >= 3) {
      logger.error("Potential distributed attack detected", {
        userAgent: violation.userAgent.substring(0, 200),
        violations: userAgentViolations.length,
        uniqueIPs: uniqueIPs.size,
        ips: Array.from(uniqueIPs).slice(0, 10), // Log first 10 IPs
        timespan: "5 minutes",
      });
    }
  }

  // Check for rapid-fire violations
  const rapidViolations = recentViolations.filter(
    v => v.ip === violation.ip && Date.now() - v.timestamp.getTime() < 30 * 1000 // Last 30 seconds
  );
  if (rapidViolations.length >= 3) {
    logger.error("Rapid-fire violation detected", {
      ip: violation.ip,
      violations: rapidViolations.length,
      timespan: "30 seconds",
      endpoints: [...new Set(rapidViolations.map(v => v.pathname))],
    });
  }
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): RateLimitStats {
  // Update top violators
  const allViolators: Array<{ key: string; count: number; type: string }> = [];

  // Add IP violators
  Object.entries(stats.violationsByIP).forEach(([ip, count]) => {
    allViolators.push({ key: ip, count, type: "ip" });
  });

  // Add endpoint violators
  Object.entries(stats.violationsByEndpoint).forEach(([endpoint, count]) => {
    allViolators.push({ key: endpoint, count, type: "endpoint" });
  });

  // Add user violators
  Object.entries(stats.violationsByUser).forEach(([userId, count]) => {
    allViolators.push({ key: userId, count, type: "user" });
  });

  // Sort and limit top violators
  stats.topViolators = allViolators.sort((a, b) => b.count - a.count).slice(0, 20);

  return { ...stats };
}

/**
 * Get recent violations (last 24 hours)
 */
export function getRecentViolations(hours: number = 24): RateLimitViolation[] {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return violations.filter(v => v.timestamp.getTime() > cutoff);
}

/**
 * Generate rate limit report
 */
export function generateRateLimitReport(): {
  summary: {
    totalRequests: number;
    totalViolations: number;
    violationRate: number;
    timeRange: string;
  };
  topEndpoints: Array<{ endpoint: string; violations: number }>;
  topIPs: Array<{ ip: string; violations: number }>;
  topUsers: Array<{ userId: string; violations: number }>;
  recentPatterns: string[];
} {
  const recentViolations = getRecentViolations(24);
  const violationRate =
    stats.totalRequests > 0 ? (stats.violations / stats.totalRequests) * 100 : 0;

  // Top endpoints by violations
  const topEndpoints = Object.entries(stats.violationsByEndpoint)
    .map(([endpoint, violations]) => ({ endpoint, violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 10);

  // Top IPs by violations
  const topIPs = Object.entries(stats.violationsByIP)
    .map(([ip, violations]) => ({ ip, violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 10);

  // Top users by violations
  const topUsers = Object.entries(stats.violationsByUser)
    .map(([userId, violations]) => ({ userId, violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 10);

  // Analyze patterns
  const patterns: string[] = [];

  if (recentViolations.length > 10) {
    patterns.push(`${recentViolations.length} violations in last 24 hours`);
  }

  const commonUserAgent = findMostCommonUserAgent(recentViolations);
  if (commonUserAgent.count > 5) {
    patterns.push(
      `Common user agent: ${commonUserAgent.userAgent} (${commonUserAgent.count} violations)`
    );
  }

  const timeDistribution = analyzeTimeDistribution(recentViolations);
  if (timeDistribution.peakHour) {
    patterns.push(
      `Peak violation time: ${timeDistribution.peakHour}:00-${timeDistribution.peakHour + 1}:00 UTC`
    );
  }

  return {
    summary: {
      totalRequests: stats.totalRequests,
      totalViolations: stats.violations,
      violationRate: Math.round(violationRate * 100) / 100,
      timeRange: "All time",
    },
    topEndpoints,
    topIPs,
    topUsers,
    recentPatterns: patterns,
  };
}

/**
 * Find most common user agent in violations
 */
function findMostCommonUserAgent(violations: RateLimitViolation[]): {
  userAgent: string;
  count: number;
} {
  const userAgentCounts: Record<string, number> = {};

  violations.forEach(v => {
    const ua = v.userAgent.substring(0, 100); // Truncate for grouping
    userAgentCounts[ua] = (userAgentCounts[ua] || 0) + 1;
  });

  const sorted = Object.entries(userAgentCounts).sort(([, a], [, b]) => b - a);

  return sorted.length > 0
    ? { userAgent: sorted[0][0], count: sorted[0][1] }
    : { userAgent: "unknown", count: 0 };
}

/**
 * Analyze time distribution of violations
 */
function analyzeTimeDistribution(violations: RateLimitViolation[]): {
  peakHour: number | null;
  hourlyDistribution: Record<number, number>;
} {
  const hourlyDistribution: Record<number, number> = {};

  violations.forEach(v => {
    const hour = v.timestamp.getUTCHours();
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
  });

  const peakHour = Object.entries(hourlyDistribution).sort(([, a], [, b]) => b - a)[0]?.[0];

  return {
    peakHour: peakHour ? parseInt(peakHour) : null,
    hourlyDistribution,
  };
}

/**
 * Reset statistics (useful for testing or periodic cleanup)
 */
export function resetRateLimitStats(): void {
  violations.length = 0;
  stats.totalRequests = 0;
  stats.violations = 0;
  stats.violationsByEndpoint = {};
  stats.violationsByIP = {};
  stats.violationsByUser = {};
  stats.topViolators = [];

  logger.info("Rate limit statistics reset");
}

/**
 * Check if an IP should be temporarily blocked
 */
export function shouldBlockIP(ip: string): boolean {
  const recentViolations = violations.filter(
    v => v.ip === ip && Date.now() - v.timestamp.getTime() < 15 * 60 * 1000 // Last 15 minutes
  );

  // Block if more than 10 violations in 15 minutes
  return recentViolations.length > 10;
}

/**
 * Export monitoring functions
 */
const rateLimitMonitor = {
  logRateLimitViolation,
  logRateLimitSuccess,
  getRateLimitStats,
  getRecentViolations,
  generateRateLimitReport,
  resetRateLimitStats,
  shouldBlockIP,
};

export default rateLimitMonitor;
