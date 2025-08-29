#!/usr/bin/env node

/**
 * Enhanced development script with health checks and monitoring
 */

// Load environment variables first
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // Also load .env as fallback

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvironment() {
  log("🔍 Checking development environment...", colors.blue);

  // Check for .env.local
  if (!fs.existsSync(".env.local")) {
    log("⚠️  .env.local not found. Creating from .env.example...", colors.yellow);

    if (fs.existsSync(".env.example")) {
      fs.copyFileSync(".env.example", ".env.local");
      log("✅ .env.local created from .env.example", colors.green);
      log("🔧 Please update .env.local with your actual values", colors.cyan);
    } else {
      log("❌ .env.example not found. Please create .env.local manually.", colors.red);
    }
  }

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.replace("v", "").split(".")[0]);

  if (majorVersion < 18) {
    log(
      `❌ Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`,
      colors.red
    );
    process.exit(1);
  }

  // Check for required dependencies
  if (!fs.existsSync("node_modules")) {
    log("📦 Installing dependencies...", colors.cyan);
    try {
      execSync("pnpm install", { stdio: "inherit" });
      log("✅ Dependencies installed", colors.green);
    } catch (error) {
      log("❌ Failed to install dependencies", colors.red);
      process.exit(1);
    }
  }

  log("✅ Environment check passed", colors.green);
}

function checkDatabase() {
  log("\n🔍 Checking database connection...", colors.blue);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    log("⚠️  MONGODB_URI not set in .env.local", colors.yellow);
    log("Database features will not work without a valid MongoDB connection", colors.yellow);
    return;
  }

  // Basic URI validation
  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    log("⚠️  MONGODB_URI format appears invalid", colors.yellow);
    return;
  }

  log("✅ Database configuration looks good", colors.green);
}

function setupDevelopmentDatabase() {
  log("\n🔧 Setting up development database...", colors.cyan);

  if (fs.existsSync("scripts/db-setup.js")) {
    try {
      execSync("node scripts/db-setup.js", { stdio: "inherit" });
      log("✅ Database setup completed", colors.green);
    } catch (error) {
      log("⚠️  Database setup encountered issues", colors.yellow);
    }
  } else {
    log("⚠️  Database setup script not found", colors.yellow);
  }
}

function runPreStartChecks() {
  log("\n🔍 Running pre-start checks...", colors.blue);

  // Quick type check
  try {
    execSync("pnpm run type-check", { stdio: "pipe" });
    log("✅ TypeScript check passed", colors.green);
  } catch (error) {
    log("⚠️  TypeScript issues detected:", colors.yellow);
    console.log(error.stdout?.toString() || error.message);
    log("Development will continue, but please fix these issues", colors.yellow);
  }

  // Quick lint check (non-blocking)
  try {
    execSync("pnpm run lint", { stdio: "pipe" });
    log("✅ ESLint check passed", colors.green);
  } catch (error) {
    log("⚠️  ESLint issues detected (non-blocking)", colors.yellow);
  }
}

function startDevServer() {
  log("\n🚀 Starting development server...", colors.magenta);
  log("==========================================", colors.magenta);

  // Set development environment
  process.env.NODE_ENV = "development";

  const devServer = spawn("pnpm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    log("\n🛑 Shutting down development server...", colors.yellow);
    devServer.kill("SIGINT");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    log("\n🛑 Shutting down development server...", colors.yellow);
    devServer.kill("SIGTERM");
    process.exit(0);
  });

  devServer.on("error", error => {
    log(`❌ Failed to start development server: ${error.message}`, colors.red);
    process.exit(1);
  });

  devServer.on("close", code => {
    if (code !== 0) {
      log(`❌ Development server exited with code ${code}`, colors.red);
      process.exit(code);
    }
  });

  return devServer;
}

function showDevelopmentInfo() {
  log("\n📋 Development Information:", colors.cyan);
  log("==========================================", colors.cyan);
  log("🌐 Local:     http://localhost:3000", colors.white);
  log("📱 Network:   Check terminal output above", colors.white);
  log("📁 Project:   " + path.basename(process.cwd()), colors.white);
  log("⚡ Mode:      Development", colors.white);
  log("", colors.white);
  log("📚 Useful commands:", colors.blue);
  log("   pnpm run lint        - Run ESLint", colors.white);
  log("   pnpm run type-check  - Run TypeScript check", colors.white);
  log("   pnpm run test        - Run tests", colors.white);
  log("   pnpm run test:watch  - Run tests in watch mode", colors.white);
  log("   pnpm run build       - Build for production", colors.white);
  log("", colors.white);
  log("💡 Tips:", colors.blue);
  log("   - Press Ctrl+C to stop the server", colors.white);
  log("   - Edit files and they will automatically reload", colors.white);
  log("   - Check browser console for any errors", colors.white);
  log("==========================================", colors.cyan);
}

function monitorPerformance() {
  // Optional: Monitor development performance
  const startTime = performance.now();

  setInterval(() => {
    const uptime = Math.round((performance.now() - startTime) / 1000);
    const memory = process.memoryUsage();
    const memoryMB = Math.round(memory.heapUsed / 1024 / 1024);

    // Only log if memory usage is high or on significant milestones
    if (memoryMB > 500 || uptime % 300 === 0) {
      // Every 5 minutes
      log(`📊 Dev Server - Uptime: ${uptime}s, Memory: ${memoryMB}MB`, colors.blue);
    }
  }, 30000); // Check every 30 seconds
}

async function main() {
  const startTime = performance.now();

  log("🚀 Starting Strive development environment...", colors.magenta);
  log("==========================================", colors.magenta);

  try {
    // Pre-flight checks
    checkEnvironment();
    checkDatabase();

    // Optional setup
    if (process.argv.includes("--setup-db")) {
      setupDevelopmentDatabase();
    }

    if (!process.argv.includes("--skip-checks")) {
      runPreStartChecks();
    }

    // Show helpful information
    showDevelopmentInfo();

    // Start performance monitoring
    if (process.argv.includes("--monitor")) {
      monitorPerformance();
    }

    // Start the dev server
    startDevServer();

    const endTime = performance.now();
    const startupTime = Math.round(endTime - startTime);
    log(`✅ Development environment ready in ${startupTime}ms`, colors.green);
  } catch (error) {
    log(`❌ Failed to start development environment: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Handle command line arguments
function showHelp() {
  console.log(`
Usage: node scripts/dev.js [options]

Options:
  --setup-db      Setup development database
  --skip-checks   Skip pre-start type and lint checks
  --monitor       Enable performance monitoring
  --help          Show this help message

Examples:
  node scripts/dev.js                    # Standard development start
  node scripts/dev.js --setup-db         # Start with database setup
  node scripts/dev.js --skip-checks      # Fast start, skip checks
  node scripts/dev.js --monitor          # Start with performance monitoring
`);
}

if (process.argv.includes("--help")) {
  showHelp();
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
