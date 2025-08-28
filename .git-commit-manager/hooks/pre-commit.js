#!/usr/bin/env node

/**
 * Pre-commit hook for WebCloudor
 * Runs linting and basic checks before allowing commits
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-commit checks...\n');

const runCommand = (command, description) => {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} passed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(error.message);
    return false;
  }
};

const checkFiles = () => {
  const requiredFiles = [
    '.env.local',
    'package.json',
    'tsconfig.json'
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      console.error(`❌ Required file missing: ${file}`);
      return false;
    }
  }
  
  console.log('✅ All required files present\n');
  return true;
};

const main = async () => {
  let success = true;

  // Check required files
  success = checkFiles() && success;

  // Run linting
  success = runCommand('npm run lint', 'Linting code') && success;

  // Type checking
  if (fs.existsSync('tsconfig.json')) {
    success = runCommand('npx tsc --noEmit', 'Type checking') && success;
  }

  // Check for console.logs in production code (warning only)
  try {
    execSync('git diff --cached --name-only | grep -E "\\.(ts|tsx|js|jsx)$" | xargs grep -l "console\\." || true', { stdio: 'pipe' });
    console.log('⚠️  Warning: Found console statements in staged files. Consider removing them for production.\n');
  } catch (error) {
    // Ignore - no console statements found
  }

  if (success) {
    console.log('🎉 All pre-commit checks passed! Proceeding with commit...\n');
    process.exit(0);
  } else {
    console.log('💥 Pre-commit checks failed. Please fix the issues and try again.\n');
    process.exit(1);
  }
};

main().catch(error => {
  console.error('Pre-commit hook error:', error);
  process.exit(1);
});