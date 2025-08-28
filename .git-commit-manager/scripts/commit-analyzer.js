#!/usr/bin/env node

/**
 * Commit Analyzer for WebCloudor
 * Analyzes changed files and suggests logical commit groupings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CommitAnalyzer {
  constructor() {
    this.config = this.loadConfig();
    this.changedFiles = this.getChangedFiles();
  }

  loadConfig() {
    const configPath = path.join(__dirname, '..', 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    throw new Error('Config file not found');
  }

  getChangedFiles() {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      return output.split('\n')
        .filter(line => line.trim())
        .map(line => ({
          status: line.substring(0, 2).trim(),
          file: line.substring(3).trim()
        }));
    } catch (error) {
      console.error('Error getting changed files:', error.message);
      return [];
    }
  }

  categorizeFiles() {
    const categories = {
      'API Changes': [],
      'UI Components': [],
      'Email System': [],
      'Blog System': [],
      'Configuration': [],
      'Styling': [],
      'Other': []
    };

    this.changedFiles.forEach(({ file, status }) => {
      let categorized = false;

      // Check against logical groups from config
      for (const group of this.config.chunkingRules.logicalGroups) {
        for (const pattern of group.patterns) {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          if (regex.test(file)) {
            categories[group.name].push({ file, status });
            categorized = true;
            break;
          }
        }
        if (categorized) break;
      }

      if (!categorized) {
        categories['Other'].push({ file, status });
      }
    });

    return categories;
  }

  suggestCommits() {
    const categories = this.categorizeFiles();
    const suggestions = [];

    Object.entries(categories).forEach(([category, files]) => {
      if (files.length === 0) return;

      const newFiles = files.filter(f => f.status.includes('A'));
      const modifiedFiles = files.filter(f => f.status.includes('M'));
      const deletedFiles = files.filter(f => f.status.includes('D'));

      // Suggest separate commits for different change types if there are many files
      if (files.length > this.config.chunkingRules.maxFilesPerCommit) {
        if (newFiles.length > 0) {
          suggestions.push({
            category: `${category} - New Files`,
            files: newFiles,
            type: this.inferCommitType(newFiles, 'feat'),
            scope: this.inferScope(newFiles.map(f => f.file))
          });
        }
        if (modifiedFiles.length > 0) {
          suggestions.push({
            category: `${category} - Updates`,
            files: modifiedFiles,
            type: this.inferCommitType(modifiedFiles, 'feat'),
            scope: this.inferScope(modifiedFiles.map(f => f.file))
          });
        }
        if (deletedFiles.length > 0) {
          suggestions.push({
            category: `${category} - Deletions`,
            files: deletedFiles,
            type: 'chore',
            scope: this.inferScope(deletedFiles.map(f => f.file))
          });
        }
      } else {
        suggestions.push({
          category,
          files,
          type: this.inferCommitType(files, 'feat'),
          scope: this.inferScope(files.map(f => f.file))
        });
      }
    });

    return suggestions;
  }

  inferCommitType(files, defaultType = 'feat') {
    const fileList = files.map(f => f.file).join(' ').toLowerCase();
    
    if (fileList.includes('test') || fileList.includes('spec')) return 'test';
    if (fileList.includes('config') || fileList.includes('package.json')) return 'build';
    if (fileList.includes('.md') || fileList.includes('readme')) return 'docs';
    if (fileList.includes('.css') || fileList.includes('style')) return 'style';
    if (fileList.includes('fix') || fileList.includes('bug')) return 'fix';
    if (files.some(f => f.status.includes('A'))) return 'feat';
    if (files.some(f => f.status.includes('D'))) return 'chore';
    
    return defaultType;
  }

  inferScope(filePaths) {
    const paths = filePaths.join(' ').toLowerCase();
    
    for (const scope of this.config.commitConventions.scopes) {
      if (paths.includes(scope)) return scope;
    }

    // Try to infer from path structure
    const firstPath = filePaths[0];
    if (firstPath.includes('src/components')) return 'ui';
    if (firstPath.includes('src/app/api')) return 'api';
    if (firstPath.includes('blog')) return 'blog';
    if (firstPath.includes('email') || firstPath.includes('newsletter')) return 'email';
    if (firstPath.includes('auth')) return 'auth';
    
    return null;
  }

  generateCommitMessage(suggestion) {
    const { type, scope, category, files } = suggestion;
    
    const scopeStr = scope ? `(${scope})` : '';
    const description = this.generateDescription(category, files);
    
    const header = `${type}${scopeStr}: ${description}`;
    const body = this.generateBody(files);
    const footer = this.config.commitTemplate.footer;

    return {
      header,
      body,
      footer,
      fullMessage: [header, '', body, '', footer].filter(Boolean).join('\n')
    };
  }

  generateDescription(category, files) {
    const actionMap = {
      'API Changes': 'add API endpoints and backend logic',
      'UI Components': 'add UI components and interfaces',
      'Email System': 'add email templates and notifications',
      'Blog System': 'enhance blog functionality and content',
      'Configuration': 'update project configuration',
      'Styling': 'update styles and visual design'
    };

    const baseDescription = actionMap[category.split(' - ')[0]] || 'update project files';
    
    if (files.length === 1) {
      const fileName = path.basename(files[0].file, path.extname(files[0].file));
      return `add ${fileName}`;
    }
    
    return baseDescription;
  }

  generateBody(files) {
    const lines = [];
    
    // Group by status
    const newFiles = files.filter(f => f.status.includes('A'));
    const modifiedFiles = files.filter(f => f.status.includes('M'));
    const deletedFiles = files.filter(f => f.status.includes('D'));

    if (newFiles.length > 0) {
      lines.push('New files:');
      newFiles.forEach(f => lines.push(`- ${f.file}`));
    }

    if (modifiedFiles.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push('Modified files:');
      modifiedFiles.forEach(f => lines.push(`- ${f.file}`));
    }

    if (deletedFiles.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push('Deleted files:');
      deletedFiles.forEach(f => lines.push(`- ${f.file}`));
    }

    return lines.join('\n');
  }

  analyze() {
    console.log('🔍 Analyzing changed files for optimal commit strategy...\n');
    
    if (this.changedFiles.length === 0) {
      console.log('ℹ️  No changed files detected.');
      return { suggestions: [] };
    }

    console.log(`📊 Found ${this.changedFiles.length} changed files:\n`);
    
    const categories = this.categorizeFiles();
    Object.entries(categories).forEach(([category, files]) => {
      if (files.length > 0) {
        console.log(`${category}: ${files.length} files`);
        files.forEach(f => console.log(`  ${f.status} ${f.file}`));
        console.log('');
      }
    });

    const suggestions = this.suggestCommits();
    
    console.log('💡 Suggested commit strategy:\n');
    suggestions.forEach((suggestion, index) => {
      const message = this.generateCommitMessage(suggestion);
      console.log(`${index + 1}. ${message.header}`);
      console.log(`   Files (${suggestion.files.length}): ${suggestion.files.map(f => f.file).join(', ')}`);
      console.log('');
    });

    return { suggestions, categories };
  }
}

// CLI usage
if (require.main === module) {
  try {
    const analyzer = new CommitAnalyzer();
    const result = analyzer.analyze();
    
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = CommitAnalyzer;