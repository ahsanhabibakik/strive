#!/usr/bin/env node

/**
 * Vercel-optimized build script
 */

import { execSync } from "child_process";

// Set environment variables for Vercel build
process.env.NODE_ENV = "production";
process.env.SKIP_ENV_VALIDATION = "true";

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/strive-build";
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "build-secret-key-minimum-32-characters";
}

console.log("🚀 Starting Vercel-optimized build...");

try {
  // Use Next.js build with specific flags to avoid hanging
  execSync("npx next build --experimental-build-mode=compile", {
    stdio: "inherit",
    timeout: 300000, // 5 minute timeout
  });
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
