#!/usr/bin/env node

/**
 * WebCloudor Commit Analyzer
 * Analyzes repository commit patterns and suggests optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');

class CommitAnalyzer {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      cyan: '\x1b[36m',
      magenta: '\x1b[35m',
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  execGit(command) {
    try {
      return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (error) {
      return '';
    }
  }

  analyzeCommitFrequency() {
    this.log('\n📊 Commit Frequency Analysis', 'blue');
    this.log('============================', 'blue');
    
    // Get commits from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString().split('T')[0];
    
    const commits = this.execGit(`git log --since="${since}" --pretty=format:"%h|%ad|%s" --date=short`);
    
    if (!commits) {
      this.log('No commits found in the last 30 days', 'yellow');
      return;
    }
    
    const commitLines = commits.split('\n');
    const commitsByDate = {};
    
    commitLines.forEach(line => {
      const [hash, date, message] = line.split('|');
      if (!commitsByDate[date]) commitsByDate[date] = [];
      commitsByDate[date].push({ hash, message });
    });
    
    this.log(`📈 Total commits in last 30 days: ${commitLines.length}`, 'green');
    this.log(`📅 Active days: ${Object.keys(commitsByDate).length}`, 'cyan');
    this.log(`⚡ Average commits per day: ${(commitLines.length / 30).toFixed(1)}`, 'yellow');
    
    // Show most active days
    const sortedDays = Object.entries(commitsByDate)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 5);
      
    this.log('\n🏆 Most active days:', 'magenta');
    sortedDays.forEach(([date, commits]) => {
      console.log(`  ${date}: ${commits.length} commits`);
    });
  }

  analyzeCommitTypes() {
    this.log('\n🏷️  Commit Type Analysis', 'blue');
    this.log('========================', 'blue');
    
    const commits = this.execGit('git log --pretty=format:"%s" -50');
    if (!commits) return;
    
    const commitMessages = commits.split('\n');
    const typePattern = /^(\w+)(\(.+\))?:/;
    const types = {};
    
    commitMessages.forEach(message => {
      const match = message.match(typePattern);
      if (match) {
        const type = match[1].toLowerCase();
        types[type] = (types[type] || 0) + 1;
      } else {
        types['other'] = (types['other'] || 0) + 1;
      }
    });
    
    const sortedTypes = Object.entries(types)
      .sort(([,a], [,b]) => b - a);
      
    this.log('📊 Commit types distribution:', 'cyan');
    sortedTypes.forEach(([type, count]) => {
      const percentage = ((count / commitMessages.length) * 100).toFixed(1);
      console.log(`  ${type}: ${count} (${percentage}%)`);
    });
  }

  analyzeFilePatterns() {
    this.log('\n📁 File Change Patterns', 'blue');
    this.log('========================', 'blue');
    
    const files = this.execGit('git log --name-only --pretty=format: -20');
    if (!files) return;
    
    const fileLines = files.split('\n').filter(f => f.trim());
    const fileTypes = {};
    const directories = {};
    
    fileLines.forEach(file => {
      const ext = file.split('.').pop() || 'no-ext';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      
      const dir = file.split('/')[0];
      directories[dir] = (directories[dir] || 0) + 1;
    });
    
    this.log('📊 Most changed file types:', 'cyan');
    Object.entries(fileTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .forEach(([ext, count]) => {
        console.log(`  .${ext}: ${count} changes`);
      });
      
    this.log('\n📂 Most active directories:', 'cyan');
    Object.entries(directories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .forEach(([dir, count]) => {
        console.log(`  ${dir}: ${count} changes`);
      });
  }

  generateRecommendations() {
    this.log('\n💡 Commit Optimization Recommendations', 'yellow');
    this.log('======================================', 'yellow');
    
    const currentFiles = this.execGit('git diff --name-only');
    const untrackedFiles = this.execGit('git ls-files --others --exclude-standard');
    const totalChanges = (currentFiles.split('\n').filter(f => f.trim()).length + 
                         untrackedFiles.split('\n').filter(f => f.trim()).length);
    
    if (totalChanges === 0) {
      this.log('✅ Working tree is clean - no immediate actions needed', 'green');
      return;
    }
    
    this.log(`📁 You have ${totalChanges} files with changes`, 'cyan');
    console.log('');
    
    if (totalChanges > 10) {
      this.log('🎯 High number of changed files detected:', 'yellow');
      console.log('  • Consider using chunked commits for better organization');
      console.log('  • Run: node scripts/auto-commit-manager.js chunked');
      console.log('');
    } else if (totalChanges > 5) {
      this.log('📊 Moderate changes detected:', 'yellow');
      console.log('  • Auto-commit with category grouping recommended');
      console.log('  • Run: node scripts/auto-commit-manager.js auto');
      console.log('');
    } else {
      this.log('⚡ Few changes detected:', 'yellow');
      console.log('  • Perfect for individual file commits');
      console.log('  • Run: ./scripts/chunk-commit.sh --interactive');
      console.log('');
    }
    
    this.log('🔧 Additional recommendations:', 'magenta');
    console.log('  • Set up pre-commit hooks for automated quality checks');
    console.log('  • Use semantic commit messages for better tracking');
    console.log('  • Consider commit frequency - aim for 3-5 commits per feature');
    console.log('  • Break large changes into smaller, logical commits');
  }

  runFullAnalysis() {
    this.log('🔍 WebCloudor Repository Analysis', 'blue');
    this.log('==================================', 'blue');
    
    // Check if in git repo
    const isGitRepo = this.execGit('git rev-parse --git-dir');
    if (!isGitRepo) {
      this.log('❌ Not in a git repository', 'red');
      return;
    }
    
    // Get basic repo info
    const repoName = this.execGit('git config --get remote.origin.url').split('/').pop().replace('.git', '') || 'local-repo';
    const currentBranch = this.execGit('git branch --show-current');
    const totalCommits = this.execGit('git rev-list --count HEAD');
    
    this.log(`📂 Repository: ${repoName}`, 'cyan');
    this.log(`🌿 Current branch: ${currentBranch}`, 'cyan');
    this.log(`📊 Total commits: ${totalCommits}`, 'cyan');
    
    this.analyzeCommitFrequency();
    this.analyzeCommitTypes();
    this.analyzeFilePatterns();
    this.generateRecommendations();
    
    this.log('\n✨ Analysis completed!', 'green');
    this.log('Use the recommendations above to optimize your commit workflow.', 'green');
  }
}

// CLI Interface
const analyzer = new CommitAnalyzer();
const command = process.argv[2] || 'full';

switch (command) {
  case 'frequency':
    analyzer.analyzeCommitFrequency();
    break;
  case 'types':
    analyzer.analyzeCommitTypes();
    break;
  case 'files':
    analyzer.analyzeFilePatterns();
    break;
  case 'recommendations':
    analyzer.generateRecommendations();
    break;
  default:
    analyzer.runFullAnalysis();
}