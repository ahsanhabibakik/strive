import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple health check without complex dependencies
    const status = {
      timestamp: new Date().toISOString(),
      service: "Strive API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || 'development',
      status: "healthy",
      checks: {
        api: "healthy",
        server: "healthy"
      }
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      service: "Strive API",
      version: "1.0.0",
      status: "error",
      error: "Health check failed"
    }, { status: 500 });
  }
}