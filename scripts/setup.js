#!/usr/bin/env node

/**
 * Project Setup Script
 * Sets up the entire project environment for development
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runCommand(command, description) {
  log(`📦 ${description}...`, 'blue');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

async function createEnvFile() {
  const envExample = path.join(process.cwd(), '.env.example');
  const envLocal = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
    log('📝 Creating .env.local from .env.example...', 'blue');
    
    const envContent = fs.readFileSync(envExample, 'utf8');
    fs.writeFileSync(envLocal, envContent);
    
    log('✅ .env.local created', 'green');
    log('⚠️  Please edit .env.local with your actual environment variables', 'yellow');
  } else if (fs.existsSync(envLocal)) {
    log('ℹ️  .env.local already exists', 'cyan');
  } else {
    log('⚠️  No .env.example found to copy from', 'yellow');
  }
}

async function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  const checks = [
    { command: 'node --version', name: 'Node.js' },
    { command: 'npm --version', name: 'npm' },
    { command: 'git --version', name: 'Git' },
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    try {
      const version = execSync(check.command, { encoding: 'utf8' }).trim();
      log(`✅ ${check.name}: ${version}`, 'green');
    } catch (error) {
      log(`❌ ${check.name} not found`, 'red');
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function setupProject() {
  log('🚀 Starting project setup...', 'cyan');
  log('=' * 50, 'cyan');
  
  // Check prerequisites
  const prerequisitesPassed = await checkPrerequisites();
  if (!prerequisitesPassed) {
    log('❌ Please install missing prerequisites and try again', 'red');
    process.exit(1);
  }
  
  // Install dependencies
  if (!await runCommand('npm install', 'Installing dependencies')) {
    log('❌ Failed to install dependencies', 'red');
    process.exit(1);
  }
  
  // Create environment file
  await createEnvFile();
  
  // Set up database
  if (!await runCommand('npm run db:setup', 'Setting up database')) {
    log('⚠️  Database setup failed - you may need to configure MONGODB_URI', 'yellow');
  }
  
  // Seed database with sample data
  if (!await runCommand('npm run db:seed', 'Seeding database with sample data')) {
    log('⚠️  Database seeding failed - continuing anyway', 'yellow');
  }
  
  // Run health check
  if (!await runCommand('npm run health-check', 'Running health check')) {
    log('⚠️  Health check failed - some services may not be configured', 'yellow');
  }
  
  // Set up git hooks (if in a git repository)
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    if (!await runCommand('npx husky install', 'Setting up git hooks')) {
      log('⚠️  Git hooks setup failed - continuing anyway', 'yellow');
    }
  } catch (error) {
    log('ℹ️  Not in a git repository - skipping git hooks setup', 'cyan');
  }
  
  // Build the application to verify everything works
  if (!await runCommand('npm run build', 'Building application')) {
    log('❌ Application build failed', 'red');
    process.exit(1);
  }
  
  log('\n🎉 Project setup completed successfully!', 'green');
  log('=' * 50, 'green');
  
  log('\n📝 Next steps:', 'cyan');
  log('1. Edit .env.local with your actual environment variables', 'yellow');
  log('2. Run "npm run dev" to start the development server', 'yellow');
  log('3. Visit http://localhost:3000 to see your application', 'yellow');
  
  log('\n🔧 Available commands:', 'cyan');
  log('• npm run dev          - Start development server', 'white');
  log('• npm run build        - Build for production', 'white');
  log('• npm run test         - Run tests', 'white');
  log('• npm run test:e2e     - Run end-to-end tests', 'white');
  log('• npm run lint         - Check code quality', 'white');
  log('• npm run health-check - Check system health', 'white');
  log('• npm run commit       - Automated git commits', 'white');
  
  log('\n🎯 Happy coding!', 'green');
}

// Run setup if called directly
if (require.main === module) {
  setupProject().catch(error => {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { setupProject };
