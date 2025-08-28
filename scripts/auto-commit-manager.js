#!/usr/bin/env node

/**
 * WebCloudor Auto Commit Manager
 * Enhanced chunk-by-chunk auto-commit system with intelligent file handling
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class AutoCommitManager {
  constructor() {
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
    
    // Determine file category
    if (filePath.includes('src/components/') || filePath.includes('components/')) return 'component';
    if (filePath.includes('/api/') || filePath.includes('api.')) return 'api';
    if (fileName.includes('page.') || fileName.includes('layout.')) return 'page';
    if (['.css', '.scss', '.sass'].includes(ext)) return 'style';
    if (fileName.includes('config') || fileName.includes('.config.')) return 'config';
    if (['.md', '.txt'].includes(ext) || dirPath.includes('doc')) return 'docs';
    if (fileName.includes('test') || fileName.includes('spec') || dirPath.includes('test')) return 'test';
    if (fileName.includes('fix') || filePath.includes('fix/')) return 'fix';
    
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

    // Group by feature/functionality
    const featureGroups = this.groupByFeature(files);
    
    for (const [feature, featureFiles] of Object.entries(featureGroups)) {
      if (featureFiles.length > 1) {
        groups.push({
          files: featureFiles,
          type: 'feature',
          name: feature,
          description: `${feature} feature implementation`
        });
        featureFiles.forEach(f => processedFiles.add(f));
      }
    }

    // Group remaining files by category and proximity
    const remainingFiles = files.filter(f => !processedFiles.has(f));
    const categoryGroups = this.groupByCategory(remainingFiles);

    for (const [category, categoryFiles] of Object.entries(categoryGroups)) {
      if (categoryFiles.length > 0) {
        // Further group by directory proximity
        const dirGroups = this.groupByDirectoryProximity(categoryFiles);
        
        for (const dirGroup of dirGroups) {
          groups.push({
            files: dirGroup.files,
            type: 'category',
            name: category,
            description: dirGroup.description
          });
        }
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

  groupByDirectoryProximity(files) {
    const dirGroups = {};
    
    files.forEach(file => {
      const dir = path.dirname(file);
      const parentDir = path.dirname(dir);
      
      // Group by immediate parent directory
      const groupKey = dir.includes('src/') ? dir : parentDir;
      
      if (!dirGroups[groupKey]) {
        dirGroups[groupKey] = [];
      }
      dirGroups[groupKey].push(file);
    });

    return Object.entries(dirGroups).map(([dir, groupFiles]) => ({
      files: groupFiles,
      description: `${path.basename(dir)} improvements`
    }));
  }

  generateGroupCommitMessage(group) {
    const { type, name, files, description } = group;
    const fileCount = files.length;
    
    let title = '';
    let body = '';
    
    if (type === 'feature') {
      title = `feat: enhance ${name} with ${fileCount} component improvements`;
      body = `\n\n- Implemented comprehensive ${name} functionality\n- Updated ${fileCount} related files with consistent patterns\n- Enhanced user experience and maintainability`;
    } else {
      const category = name;
      const primaryFile = path.basename(files[0]).replace(/\.(tsx?|jsx?|css|scss|md)$/, '');
      
      if (fileCount === 1) {
        return this.generateHumanCommitMessage(category, primaryFile);
      }
      
      const actions = {
        component: 'refactor',
        api: 'enhance',
        page: 'update',
        style: 'polish',
        config: 'chore',
        docs: 'docs',
        test: 'test'
      };
      
      const action = actions[category] || 'update';
      title = `${action}: improve ${description} (${fileCount} files)`;
      body = `\n\n- Updated ${fileCount} ${category} files with consistent improvements\n- Enhanced functionality and code organization\n- Maintained WebCloudor development standards`;
    }
    
    // Add file list for multi-file commits
    if (fileCount > 1) {
      body += `\n\nFiles updated:\n${files.map(f => `- ${path.basename(f)}`).join('\n')}`;
    }
    
    return title + body;
  }

  async commitFileGroup(group) {
    const { files, description } = group;
    const commitMessage = this.generateGroupCommitMessage(group);
    
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