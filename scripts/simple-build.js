#!/usr/bin/env node

/**
 * Simple build script that just runs Next.js build
 */

import { execSync } from "child_process";

// Set environment variables
process.env.NODE_ENV = "production";
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/strive-build";
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "build-secret-key-minimum-32-characters";
}

console.log("🚀 Starting Next.js production build...");

try {
  execSync("pnpm run build:next", { stdio: "inherit" });
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
