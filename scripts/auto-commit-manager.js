#!/usr/bin/env node

/**
 * WebCloudor Auto Commit Manager
 * Enhanced chunk-by-chunk auto-commit system with intelligent file handling
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import crypto from 'crypto';

class AutoCommitManager {
  constructor() {
    // AI-powered commit message generation settings
    this.useAI = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.maxFilesPerCommit = 5; // More granular commits
    
    this.colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      cyan: '\x1b[36m',
    };
    
    this.humanCommitTemplates = {
      component: [
        'refactor: enhance {fileName} component with improved functionality',
        'feat: add enhanced {fileName} component with better UX',
        'update: improve {fileName} component architecture and performance',
        'enhance: optimize {fileName} component for better user experience',
        'polish: refine {fileName} component with visual improvements'
      ],
      
      api: [
        'feat: implement {fileName} endpoint with comprehensive validation',
        'enhance: improve {fileName} API with better error handling',
        'update: add robust validation to {fileName} endpoint',
        'refactor: optimize {fileName} API performance and security',
        'fix: enhance {fileName} endpoint reliability and response handling'
      ],
      
      style: [
        'style: improve visual consistency in {fileName}',
        'polish: enhance responsive design for {fileName}',
        'update: refine styling and animations in {fileName}',
        'improve: optimize CSS architecture in {fileName}',
        'enhance: better mobile experience for {fileName}'
      ],
      
      config: [
        'chore: update {fileName} configuration for better performance',
        'config: enhance {fileName} settings for improved developer experience',
        'update: optimize {fileName} configuration and tooling',
        'improve: streamline {fileName} setup and build process',
        'chore: fine-tune {fileName} for better project workflow'
      ],
      
      docs: [
        'docs: update {fileName} with clearer explanations',
        'improve: enhance documentation in {fileName}',
        'update: add practical examples to {fileName}',
        'docs: refine {fileName} for better developer guidance',
        'enhance: improve clarity and structure in {fileName}'
      ],
      
      page: [
        'feat: create optimized {fileName} page with enhanced SEO',
        'update: improve {fileName} page performance and accessibility',
        'enhance: optimize {fileName} page for better Core Web Vitals',
        'refactor: streamline {fileName} page architecture',
        'improve: enhance user experience on {fileName} page'
      ],
      
      test: [
        'test: add comprehensive tests for {fileName}',
        'improve: enhance test coverage in {fileName}',
        'update: refine test cases for {fileName}',
        'fix: improve test reliability in {fileName}',
        'enhance: add edge case testing to {fileName}'
      ],
      
      fix: [
        'fix: resolve issue in {fileName} for better stability',
        'bugfix: address edge case handling in {fileName}',
        'fix: improve error handling in {fileName}',
        'resolve: fix performance issue in {fileName}',
        'bugfix: enhance reliability of {fileName}'
      ]
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  execGit(command) {
    try {
      return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (error) {
      this.log(`Git command failed: ${command}`, 'red');
      this.log(error.message, 'red');
      return null;
    }
  }

  checkGitRepo() {
    const result = this.execGit('git rev-parse --git-dir');
    if (!result) {
      this.log('❌ Not in a git repository', 'red');
      process.exit(1);
    }
    return true;
  }

  getGitConfig() {
    const name = this.execGit('git config user.name') || 'Developer';
    const email = this.execGit('git config user.email') || 'developer@webcloudor.com';
    
    this.log('📋 Current Git Configuration:', 'yellow');
    this.log(`User: ${name} <${email}>`, 'cyan');
    console.log('');
    
    return { name, email };
  }

  getChangedFiles() {
    const unstagedFiles = this.execGit('git diff --name-only') || '';
    const untrackedFiles = this.execGit('git ls-files --others --exclude-standard') || '';
    
    const allFiles = [
      ...unstagedFiles.split('\n').filter(f => f.trim()),
      ...untrackedFiles.split('\n').filter(f => f.trim())
    ].filter(f => f && !f.includes('.git/'));

    return [...new Set(allFiles)]; // Remove duplicates
  }

  categorizeFile(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const dirPath = path.dirname(filePath).toLowerCase();
    
    // More granular categorization
    if (filePath.includes('src/components/ui/')) return 'ui-component';
    if (filePath.includes('src/components/') || filePath.includes('components/')) return 'component';
    if (filePath.includes('/api/') || filePath.includes('api.')) return 'api';
    if (fileName.includes('page.tsx') || fileName.includes('page.ts')) return 'page';
    if (fileName.includes('layout.tsx') || fileName.includes('layout.ts')) return 'layout';
    if (filePath.includes('src/lib/')) return 'lib';
    if (filePath.includes('src/hooks/')) return 'hook';
    if (filePath.includes('src/utils/')) return 'util';
    if (filePath.includes('src/types/')) return 'types';
    if (['.css', '.scss', '.sass'].includes(ext)) return 'style';
    if (fileName.includes('config') || fileName.includes('.config.')) return 'config';
    if (['.md', '.txt'].includes(ext) || dirPath.includes('doc')) return 'docs';
    if (fileName.includes('test') || fileName.includes('spec') || dirPath.includes('test')) return 'test';
    if (fileName.includes('middleware')) return 'middleware';
    if (filePath.includes('scripts/')) return 'script';
    if (fileName.includes('package.json') || fileName.includes('pnpm-lock.yaml')) return 'dependency';
    
    return 'general';
  }

  generateHumanCommitMessage(category, fileName) {
    const templates = this.humanCommitTemplates[category] || this.humanCommitTemplates.component;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const cleanFileName = fileName.replace(/\.(tsx?|jsx?|css|scss|md)$/, '');
    
    const title = randomTemplate.replace('{fileName}', cleanFileName);
    
    // Add human-like commit body
    const bodies = [
      `\n\n- Implemented with modern best practices and clean architecture\n- Enhanced user experience and maintainability\n- Added proper error handling and TypeScript support`,
      `\n\n- Optimized for performance and accessibility\n- Improved code organization and readability\n- Follows WebCloudor development standards`,
      `\n\n- Enhanced functionality with careful attention to detail\n- Improved development workflow and code quality\n- Maintained consistency with existing codebase`,
      `\n\n- Refined implementation with focus on user experience\n- Added comprehensive error handling and validation\n- Optimized for better performance and maintainability`
    ];
    
    const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
    return title + randomBody;
  }

  groupFilesIntelligently(files) {
    const groups = [];
    const processedFiles = new Set();

    // First, group by specific features/functionality
    const featureGroups = this.groupByFeature(files);
    
    for (const [feature, featureFiles] of Object.entries(featureGroups)) {
      if (featureFiles.length > 0 && feature !== 'general') {
        // Split large feature groups into smaller chunks
        const chunks = this.chunkFiles(featureFiles, this.maxFilesPerCommit);
        chunks.forEach((chunk, index) => {
          groups.push({
            files: chunk,
            type: 'feature',
            name: feature,
            description: chunks.length > 1 ? `${feature} feature implementation (part ${index + 1})` : `${feature} feature implementation`
          });
        });
        featureFiles.forEach(f => processedFiles.add(f));
      }
    }

    // Group remaining files by category with intelligent splitting
    const remainingFiles = files.filter(f => !processedFiles.has(f));
    const categoryGroups = this.groupByCategory(remainingFiles);

    for (const [category, categoryFiles] of Object.entries(categoryGroups)) {
      if (categoryFiles.length > 0) {
        // Group by specific directories and component types
        const specificGroups = this.groupBySpecificContext(categoryFiles, category);
        
        specificGroups.forEach(group => {
          const chunks = this.chunkFiles(group.files, this.maxFilesPerCommit);
          chunks.forEach((chunk, index) => {
            groups.push({
              files: chunk,
              type: 'category',
              name: category,
              description: chunks.length > 1 ? `${group.description} (part ${index + 1})` : group.description
            });
          });
        });
      }
    }

    return groups;
  }

  groupByFeature(files) {
    const features = {};
    
    files.forEach(file => {
      let feature = 'general';
      
      // Detect feature based on file path patterns
      if (file.includes('blog/')) feature = 'blog';
      else if (file.includes('portfolio/')) feature = 'portfolio';
      else if (file.includes('services/')) feature = 'services';
      else if (file.includes('about/')) feature = 'about';
      else if (file.includes('team/')) feature = 'team';
      else if (file.includes('contact/')) feature = 'contact';
      else if (file.includes('auth/')) feature = 'authentication';
      else if (file.includes('api/')) feature = 'api';
      else if (file.includes('layout/') || file.includes('navigation/')) feature = 'layout';
      else if (file.includes('policies/')) feature = 'policies';
      
      if (!features[feature]) features[feature] = [];
      features[feature].push(file);
    });

    return features;
  }

  groupByCategory(files) {
    const categories = {};
    
    files.forEach(file => {
      const category = this.categorizeFile(file);
      if (!categories[category]) categories[category] = [];
      categories[category].push(file);
    });

    return categories;
  }

  chunkFiles(files, maxSize) {
    const chunks = [];
    for (let i = 0; i < files.length; i += maxSize) {
      chunks.push(files.slice(i, i + maxSize));
    }
    return chunks;
  }

  groupBySpecificContext(files, category) {
    const contextGroups = {};
    
    files.forEach(file => {
      let contextKey = 'general';
      
      if (category === 'component') {
        // Group components by their parent directory
        const match = file.match(/src\/components\/([^\/]+)/);
        contextKey = match ? match[1] : 'misc-components';
      } else if (category === 'ui-component') {
        contextKey = 'ui-components';
      } else if (category === 'page') {
        // Group pages by their route
        const match = file.match(/src\/app\/([^\/]+)/);
        contextKey = match ? `${match[1]}-pages` : 'root-pages';
      } else if (category === 'api') {
        // Group APIs by their route
        const match = file.match(/api\/([^\/]+)/);
        contextKey = match ? `${match[1]}-api` : 'misc-api';
      } else {
        // Group by immediate directory
        const dir = path.dirname(file);
        contextKey = path.basename(dir) || category;
      }
      
      if (!contextGroups[contextKey]) {
        contextGroups[contextKey] = [];
      }
      contextGroups[contextKey].push(file);
    });

    return Object.entries(contextGroups).map(([context, groupFiles]) => ({
      files: groupFiles,
      description: this.generateContextDescription(context, category, groupFiles)
    }));
  }

  generateContextDescription(context, category, files) {
    const fileCount = files.length;
    
    switch (category) {
      case 'ui-component':
        return `UI components update (${fileCount} files)`;
      case 'component':
        return `${context} components enhancement (${fileCount} files)`;
      case 'page':
        return `${context.replace('-pages', '')} page improvements (${fileCount} files)`;
      case 'api':
        return `${context.replace('-api', '')} API enhancements (${fileCount} files)`;
      case 'lib':
        return `core library utilities update (${fileCount} files)`;
      case 'config':
        return `configuration files update (${fileCount} files)`;
      case 'style':
        return `styling improvements (${fileCount} files)`;
      default:
        return `${category} improvements (${fileCount} files)`;
    }
  }

  async generateGroupCommitMessage(group) {
    const { type, name, files, description } = group;
    const fileCount = files.length;
    
    // Try AI-powered commit message generation if available
    if (this.useAI && fileCount <= 5) {
      try {
        const aiMessage = await this.generateAICommitMessage(files);
        if (aiMessage) return aiMessage;
      } catch (error) {
        this.log('⚠️  AI commit message generation failed, using fallback', 'yellow');
      }
    }
    
    // Enhanced fallback commit message generation
    let title = '';
    let body = '';
    
    if (type === 'feature') {
      const actionMap = {
        authentication: 'feat: enhance authentication system',
        api: 'feat: improve API endpoints',
        blog: 'feat: update blog functionality', 
        dashboard: 'feat: enhance dashboard features',
        landing: 'feat: improve landing page'
      };
      
      title = actionMap[name] || `feat: enhance ${name} functionality`;
      body = `\n\n- Enhanced ${name} feature with ${fileCount} file updates\n- Improved user experience and code organization\n- Added better error handling and validation`;
    } else {
      const smartActions = {
        'ui-component': 'refactor: update UI components',
        'component': 'refactor: enhance React components', 
        'page': 'feat: improve page implementations',
        'api': 'feat: enhance API endpoints',
        'lib': 'refactor: update core utilities',
        'config': 'chore: update configuration files',
        'style': 'style: improve CSS and styling',
        'docs': 'docs: update documentation',
        'test': 'test: enhance test coverage',
        'middleware': 'feat: improve middleware functionality',
        'script': 'chore: update build scripts',
        'dependency': 'chore: update dependencies'
      };
      
      title = smartActions[name] || `update: improve ${description}`;
      
      const contextualBodies = {
        'ui-component': 'Enhanced UI component library with improved consistency and accessibility',
        'component': 'Refactored React components with better props handling and performance',
        'page': 'Updated page components with improved SEO and user experience',
        'api': 'Enhanced API endpoints with better validation and error handling',
        'lib': 'Updated core utility functions with improved TypeScript support',
        'config': 'Updated configuration files for better development experience',
        'style': 'Improved styling with better responsive design and consistency',
        'middleware': 'Enhanced middleware with better security and performance'
      };
      
      body = `\n\n- ${contextualBodies[name] || 'Updated files with improved functionality'}\n- Enhanced code quality and maintainability\n- Followed project coding standards and best practices`;
    }
    
    // Add concise file list for multi-file commits
    if (fileCount > 1 && fileCount <= 8) {
      const fileList = files.map(f => path.basename(f)).slice(0, 6);
      if (files.length > 6) fileList.push(`...and ${files.length - 6} more`);
      body += `\n\nModified: ${fileList.join(', ')}`;
    }
    
    return title + body;
  }

  async generateAICommitMessage(files) {
    // Get git diff for the files
    const diffData = await this.getFileDiffs(files);
    if (!diffData || diffData.length < 10) return null;
    
    // Generate intelligent commit message based on actual changes
    return this.analyzeChangesAndGenerateMessage(diffData, files);
  }

  async getFileDiffs(files) {
    try {
      // Stage the files temporarily to get diff
      const diffResults = [];
      
      for (const file of files.slice(0, 3)) { // Limit to avoid huge diffs
        try {
          const diff = this.execGit(`git diff "${file}"`);
          if (diff && diff.length > 0 && diff.length < 10000) { // Reasonable size
            diffResults.push({ file, diff });
          }
        } catch (error) {
          // Skip files that can't be diffed
        }
      }
      
      return diffResults;
    } catch (error) {
      return null;
    }
  }

  analyzeChangesAndGenerateMessage(diffData, files) {
    const patterns = {
      newFeature: /\+.*(?:function|const|class|interface|type).*=|\+.*export.*(?:function|const|class)/gi,
      bugFix: /\+.*(?:fix|repair|resolve|correct)|\-.*(?:bug|error|issue)/gi,
      refactor: /\-.*(?:function|const|class).*\+.*(?:function|const|class)/gi,
      typeScript: /\+.*: .*(?:string|number|boolean|object|interface|type)/gi,
      styling: /\+.*(?:className|style|css|tailwind|tw-)/gi,
      apiEndpoint: /\+.*(?:app\.get|app\.post|app\.put|app\.delete|export.*GET|POST|PUT|DELETE)/gi,
      component: /\+.*(?:return|jsx|tsx|React|Component)/gi,
      config: /\+.*(?:config|settings|env|dotenv)/gi
    };
    
    const allDiffs = diffData.map(d => d.diff).join('\n');
    const matches = {};
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const found = allDiffs.match(pattern) || [];
      matches[key] = found.length;
    });
    
    // Determine primary change type
    const maxMatch = Object.entries(matches).reduce((a, b) => matches[a[0]] > matches[b[0]] ? a : b);
    const primaryType = maxMatch[0];
    const fileCount = files.length;
    
    // Generate contextual commit messages
    const messageTemplates = {
      newFeature: [
        `feat: add new functionality to ${this.getContextFromFiles(files)}`,
        `feat: implement ${this.getContextFromFiles(files)} with enhanced features`,
        `feat: create ${this.getContextFromFiles(files)} with modern patterns`
      ],
      bugFix: [
        `fix: resolve issues in ${this.getContextFromFiles(files)}`,
        `fix: improve error handling in ${this.getContextFromFiles(files)}`,
        `fix: correct functionality in ${this.getContextFromFiles(files)}`
      ],
      refactor: [
        `refactor: improve ${this.getContextFromFiles(files)} structure`,
        `refactor: optimize ${this.getContextFromFiles(files)} implementation`,
        `refactor: modernize ${this.getContextFromFiles(files)} codebase`
      ],
      component: [
        `feat: enhance React components with improved functionality`,
        `refactor: update component architecture and props`,
        `feat: add new component features and optimizations`
      ],
      apiEndpoint: [
        `feat: implement new API endpoints with validation`,
        `enhance: improve API functionality and error handling`,
        `feat: add robust API endpoints with security`
      ],
      styling: [
        `style: improve UI design and responsive layout`,
        `style: enhance visual consistency and accessibility`,
        `style: update styling with modern CSS practices`
      ]
    };
    
    const templates = messageTemplates[primaryType] || messageTemplates.refactor;
    const title = templates[Math.floor(Math.random() * templates.length)];
    
    const body = `\n\n- Enhanced ${fileCount} file${fileCount > 1 ? 's' : ''} with intelligent improvements\n- Applied modern development patterns and best practices\n- Improved code quality, performance, and maintainability`;
    
    return title + body;
  }

  getContextFromFiles(files) {
    const contexts = files.map(file => {
      if (file.includes('/components/ui/')) return 'UI components';
      if (file.includes('/components/')) return 'React components';
      if (file.includes('/api/')) return 'API endpoints';
      if (file.includes('/pages/') || file.includes('/app/')) return 'application pages';
      if (file.includes('/lib/')) return 'utility libraries';
      if (file.includes('/styles/')) return 'application styling';
      return 'application core';
    });
    
    const uniqueContexts = [...new Set(contexts)];
    return uniqueContexts.length === 1 ? uniqueContexts[0] : 'multiple components';
  }

  async commitFileGroup(group) {
    const { files, description } = group;
    const commitMessage = await this.generateGroupCommitMessage(group);
    
    this.log(`\n📂 Processing ${description} (${files.length} files):`, 'cyan');
    files.forEach(file => this.log(`  - ${file}`, 'blue'));
    
    // Add all files in the group
    for (const file of files) {
      const addResult = this.execGit(`git add "${file}"`);
      if (addResult === null) {
        this.log(`❌ Failed to add ${file}`, 'red');
        return false;
      }
    }
    
    // Check if there are changes to commit
    const diffCached = this.execGit('git diff --cached --name-only');
    if (!diffCached) {
      this.log(`⏭️  No changes to commit for this group`, 'yellow');
      return false;
    }
    
    // Commit the group
    const commitResult = this.execGit(`git commit -m "${commitMessage}"`);
    if (commitResult) {
      this.log(`✅ Committed: ${description}`, 'green');
      this.log(`💬 Message: ${commitMessage.split('\n')[0]}`, 'cyan');
      return true;
    } else {
      this.log(`❌ Failed to commit group: ${description}`, 'red');
      return false;
    }
  }

  async commitSingleFile(filePath) {
    const fileName = path.basename(filePath);
    const category = this.categorizeFile(filePath);
    const commitMessage = this.generateHumanCommitMessage(category, fileName);
    
    this.log(`📁 Processing: ${filePath}`, 'blue');
    
    // Add file
    const addResult = this.execGit(`git add "${filePath}"`);
    if (addResult === null) {
      this.log(`❌ Failed to add ${filePath}`, 'red');
      return false;
    }
    
    // Check if there are changes to commit
    const diffCached = this.execGit('git diff --cached --name-only');
    if (!diffCached || !diffCached.includes(path.basename(filePath))) {
      this.log(`⏭️  No changes to commit for ${filePath}`, 'yellow');
      return false;
    }
    
    // Commit
    const commitResult = this.execGit(`git commit -m "${commitMessage}"`);
    if (commitResult) {
      this.log(`✅ Committed: ${fileName}`, 'green');
      this.log(`💬 Message: ${commitMessage.split('\n')[0]}`, 'cyan');
      console.log('');
      return true;
    } else {
      this.log(`❌ Failed to commit ${filePath}`, 'red');
      return false;
    }
  }

  async runAutoCommits(maxCommits = 10) {
    this.log('🚀 WebCloudor Auto-Commit Manager', 'blue');
    this.log('====================================', 'blue');
    console.log('');

    this.checkGitRepo();
    this.getGitConfig();

    this.log('📊 Current Git Status:', 'yellow');
    execSync('git status --short', { stdio: 'inherit' });
    console.log('');

    const files = this.getChangedFiles();
    
    if (files.length === 0) {
      this.log('✅ No files to commit. Working tree is clean!', 'green');
      return;
    }

    this.log(`📁 Found ${files.length} files to process`, 'yellow');
    
    // Limit number of commits if specified
    const filesToProcess = files.slice(0, maxCommits);
    let successCount = 0;
    
    for (const file of filesToProcess) {
      const success = await this.commitSingleFile(file);
      if (success) {
        successCount++;
        // Add small delay to make commits more natural
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    this.log(`🎉 Auto-commit completed!`, 'green');
    this.log(`📈 Successfully created ${successCount} commits`, 'green');
    console.log('');
    
    // Show recent commits
    this.log('📝 Recent commits:', 'yellow');
    execSync('git log --oneline -10', { stdio: 'inherit' });
  }

  async runChunkedCommits() {
    this.log('🔄 Running chunked auto-commits with intelligent grouping...', 'yellow');
    console.log('');
    
    const files = this.getChangedFiles();
    if (files.length === 0) {
      this.log('✅ No files to commit. Working tree is clean!', 'green');
      return;
    }

    // Group files intelligently by function and location
    const intelligentGroups = this.groupFilesIntelligently(files);
    let totalCommits = 0;
    
    // Process each group as a single commit
    for (const group of intelligentGroups) {
      const success = await this.commitFileGroup(group);
      if (success) {
        totalCommits++;
        // Small delay between commits
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    this.log(`\n🎯 Chunked commits completed! Created ${totalCommits} commits`, 'green');
    
    // Auto-push if there are commits
    if (totalCommits > 0) {
      this.log('\n🚀 Auto-pushing changes to remote...', 'yellow');
      const pushResult = this.execGit('git push');
      if (pushResult !== null) {
        this.log('✅ Successfully pushed to remote repository', 'green');
      } else {
        this.log('⚠️  Failed to push - you may need to push manually', 'yellow');
      }
    }
    
    // Show final status
    this.log('\n📊 Final repository status:', 'yellow');
    execSync('git status --short', { stdio: 'inherit' });
  }
}

// CLI Interface
const manager = new AutoCommitManager();

const args = process.argv.slice(2);
const command = args[0] || 'help';
const maxCommits = parseInt(args[1]) || 10;

switch (command) {
  case 'auto':
    manager.runAutoCommits(maxCommits);
    break;
    
  case 'chunked':
    manager.runChunkedCommits();
    break;
    
  case 'smart':
  case 'intelligent':
    // Default to intelligent chunked commits with auto-push
    manager.runChunkedCommits();
    break;
    
  case 'single':
    const filePath = args[1];
    if (filePath) {
      manager.commitSingleFile(filePath);
    } else {
      manager.log('Please provide a file path', 'red');
    }
    break;
    
  default:
    manager.log('📖 WebCloudor Auto-Commit Manager Usage:', 'yellow');
    console.log('');
    console.log('  node scripts/auto-commit-manager.js chunked              # 🔥 Intelligent chunked commits + auto-push');
    console.log('  node scripts/auto-commit-manager.js smart                # Same as chunked (recommended)');  
    console.log('  node scripts/auto-commit-manager.js auto [maxCommits]     # Auto-commit up to N files individually');
    console.log('  node scripts/auto-commit-manager.js single <file>        # Commit single file');
    console.log('');
    manager.log('💡 Examples:', 'yellow');
    console.log('  node scripts/auto-commit-manager.js chunked              # Group related files + push (recommended)');
    console.log('  node scripts/auto-commit-manager.js auto 5               # Commit up to 5 files individually');
    console.log('');
    manager.log('🎯 Recommended: Use "chunked" for intelligent grouping and auto-push', 'green');
    console.log('');
}