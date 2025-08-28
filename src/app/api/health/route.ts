import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    service: "Strive API",
    version: "1.0.0",
    status: "healthy",
    checks: {
      database: "unknown",
      sanity: "unknown",
    }
  };

  try {
    // Test MongoDB connection
    if (process.env.MONGODB_URI) {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      await client.close();
      status.checks.database = "healthy";
    } else {
      status.checks.database = "not_configured";
    }
  } catch (error) {
    status.checks.database = "error";
    status.status = "degraded";
  }

  try {
    // Test Sanity connection
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const { client } = await import("@/lib/sanity");
      await client.fetch('*[_type == "blogPost"][0]');
      status.checks.sanity = "healthy";
    } else {
      status.checks.sanity = "not_configured";
    }
  } catch (error) {
    status.checks.sanity = "error";
  }

  return NextResponse.json(status);
}