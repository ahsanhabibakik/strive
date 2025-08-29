/**
 * Example API route demonstrating rate limiting integration
 * This file serves as a template for implementing rate limiting in your API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/errors";
import { createRateLimit, createUserRateLimit } from "@/lib/middleware/rate-limit";
import { requireAuth } from "@/lib/middleware/auth";

// Example 1: Basic IP-based rate limiting
const basicRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
});

/**
 * GET /api/example-rate-limited
 * Public endpoint with IP-based rate limiting
 */
export const GET = basicRateLimit(
  asyncHandler(async (request: NextRequest) => {
    // Your API logic here
    return NextResponse.json({
      success: true,
      data: {
        message: "This is a rate-limited public endpoint",
        timestamp: new Date().toISOString(),
        ip: request.headers.get("x-forwarded-for") || "unknown",
      },
    });
  })
);

// Example 2: User-based rate limiting for authenticated endpoints
const userRateLimit = createUserRateLimit("example-api", {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour per user
  message: "You have exceeded your hourly request limit",
  standardHeaders: true,
});

/**
 * POST /api/example-rate-limited
 * Authenticated endpoint with user-based rate limiting
 */
export const POST = requireAuth(
  userRateLimit(
    asyncHandler(async (request: NextRequest & { user?: any }) => {
      const body = await request.json();

      // Your API logic here
      return NextResponse.json({
        success: true,
        data: {
          message: "This is a rate-limited authenticated endpoint",
          userId: request.user?.id,
          requestData: body,
          timestamp: new Date().toISOString(),
        },
      });
    })
  )
);

// Example 3: Custom rate limiting with advanced options
const customRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: "This is a strictly rate-limited endpoint",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: NextRequest) => {
    // Custom key generator - you can combine IP + user ID or other identifiers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Create a unique key based on IP + first part of user agent
    const userAgentHash = userAgent.substring(0, 50);
    return `custom:${ip}:${userAgentHash}`;
  },
  onLimitReached: (req: NextRequest) => {
    // Custom callback when rate limit is reached
    console.warn("Rate limit reached for custom endpoint:", {
      ip: req.headers.get("x-forwarded-for"),
      path: req.nextUrl.pathname,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * PUT /api/example-rate-limited
 * Endpoint with custom rate limiting configuration
 */
export const PUT = customRateLimit(
  asyncHandler(async (request: NextRequest) => {
    const body = await request.json();

    // Your API logic here
    return NextResponse.json({
      success: true,
      data: {
        message: "This endpoint has custom rate limiting",
        requestData: body,
        timestamp: new Date().toISOString(),
      },
    });
  })
);
