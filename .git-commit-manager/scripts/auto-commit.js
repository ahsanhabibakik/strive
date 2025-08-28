#!/usr/bin/env node

/**
 * Auto-commit script for WebCloudor
 * Automatically creates logical commits based on file analysis
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const CommitAnalyzer = require('./commit-analyzer');

class AutoCommit {
  constructor() {
    this.config = this.loadConfig();
    this.analyzer = new CommitAnalyzer();
  }

  loadConfig() {
    const configPath = path.join(__dirname, '..', 'config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  async runCommand(command, description) {
    try {
      console.log(`⏳ ${description}...`);
      const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
      console.log(`✅ ${description} completed`);
      return { success: true, output };
    } catch (error) {
      console.error(`❌ ${description} failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async createCommit(suggestion) {
    const message = this.analyzer.generateCommitMessage(suggestion);
    const files = suggestion.files.map(f => f.file);

    try {
      // Stage the files
      for (const file of files) {
        await this.runCommand(`git add "${file}"`, `Staging ${file}`);
      }

      // Create commit with proper message formatting
      const commitCommand = `git commit -m "${message.header}" -m "${message.body}" -m "${message.footer}"`;
      const result = await this.runCommand(commitCommand, 'Creating commit');
      
      if (result.success) {
        console.log(`📝 Committed: ${message.header}\n`);
        return true;
      } else {
        console.error(`Failed to create commit: ${result.error}\n`);
        return false;
      }
    } catch (error) {
      console.error(`Error creating commit: ${error.message}\n`);
      return false;
    }
  }

  async runTests() {
    if (!this.config.autoCommit.requireTests) return true;

    console.log('🧪 Running tests...');
    const testResult = await this.runCommand(this.config.testCommand, 'Running tests');
    return testResult.success;
  }

  async runBuild() {
    if (!this.config.autoCommit.requireBuild) return true;

    console.log('🏗️  Running build...');
    const buildResult = await this.runCommand(this.config.buildCommand, 'Building project');
    return buildResult.success;
  }

  async pushChanges() {
    if (this.config.pushStrategy !== 'after-successful-build') return true;

    console.log('📤 Pushing to remote...');
    
    // Get current branch
    const branchResult = await this.runCommand('git branch --show-current', 'Getting current branch');
    if (!branchResult.success) return false;

    const currentBranch = branchResult.output.trim();
    const pushResult = await this.runCommand(`git push origin ${currentBranch}`, 'Pushing changes');
    
    return pushResult.success;
  }

  async autoCommitAll() {
    console.log('🚀 Starting auto-commit process for WebCloudor...\n');

    // Analyze changes
    const { suggestions } = this.analyzer.analyze();

    if (suggestions.length === 0) {
      console.log('ℹ️  No changes to commit.');
      return;
    }

    console.log(`📋 Planning ${suggestions.length} commits...\n`);

    let successfulCommits = 0;
    const commitHashes = [];

    // Create commits
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      console.log(`\n📝 Creating commit ${i + 1}/${suggestions.length}:`);
      console.log(`   Category: ${suggestion.category}`);
      console.log(`   Files: ${suggestion.files.length}`);

      const success = await this.createCommit(suggestion);
      if (success) {
        successfulCommits++;
        // Get the commit hash
        const hashResult = await this.runCommand('git rev-parse HEAD', 'Getting commit hash');
        if (hashResult.success) {
          commitHashes.push(hashResult.output.trim().substring(0, 7));
        }
      }
    }

    if (successfulCommits === 0) {
      console.log('❌ No commits were created successfully.');
      return;
    }

    console.log(`\n✅ Successfully created ${successfulCommits}/${suggestions.length} commits`);
    console.log(`📋 Commit hashes: ${commitHashes.join(', ')}\n`);

    // Run tests if required
    if (this.config.autoCommit.requireTests) {
      const testsPass = await this.runTests();
      if (!testsPass) {
        console.log('❌ Tests failed. Commits created but not pushed.');
        return;
      }
    }

    // Run build if required  
    if (this.config.autoCommit.requireBuild) {
      const buildPass = await this.runBuild();
      if (!buildPass) {
        console.log('❌ Build failed. Commits created but not pushed.');
        return;
      }
    }

    // Push changes
    if (this.config.pushStrategy === 'after-successful-build') {
      const pushSuccess = await this.pushChanges();
      if (pushSuccess) {
        console.log('🎉 All commits pushed successfully!');
      } else {
        console.log('❌ Failed to push commits. Please push manually.');
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Commits created: ${successfulCommits}`);
    console.log(`   Tests: ${this.config.autoCommit.requireTests ? '✅ Passed' : '⏭️  Skipped'}`);
    console.log(`   Build: ${this.config.autoCommit.requireBuild ? '✅ Passed' : '⏭️  Skipped'}`);
    console.log(`   Push: ${this.config.pushStrategy === 'after-successful-build' ? '✅ Completed' : '⏭️  Manual'}`);
  }

  async interactiveCommit() {
    console.log('🎯 Interactive commit mode for WebCloudor...\n');

    const { suggestions } = this.analyzer.analyze();
    
    if (suggestions.length === 0) {
      console.log('ℹ️  No changes to commit.');
      return;
    }

    console.log('📋 Suggested commits:\n');
    suggestions.forEach((suggestion, index) => {
      const message = this.analyzer.generateCommitMessage(suggestion);
      console.log(`${index + 1}. ${message.header}`);
      console.log(`   Files: ${suggestion.files.map(f => f.file).join(', ')}`);
      console.log('');
    });

    // For now, just auto-commit all (interactive mode would need readline)
    console.log('🤖 Auto-committing all suggestions...\n');
    await this.autoCommitAll();
  }
}

// CLI usage
if (require.main === module) {
  const autoCommit = new AutoCommit();
  
  if (process.argv.includes('--interactive')) {
    autoCommit.interactiveCommit().catch(console.error);
  } else {
    autoCommit.autoCommitAll().catch(console.error);
  }
}

module.exports = AutoCommit;