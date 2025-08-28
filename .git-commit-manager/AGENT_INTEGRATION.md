# Git Commit Manager Agent Integration

This document explains how the git-commit-manager agent integrates with Claude Code for automated commit workflows.

## Agent Usage Pattern

The git-commit-manager agent should be used when:

1. **Multiple files are changed** across different features/areas
2. **Complex changes** need logical organization
3. **Build/test validation** is required before pushing
4. **Consistent commit history** is important

## Trigger Phrases

Claude Code will automatically use the git-commit-manager agent when users say things like:

- "I've completed the user authentication system, please commit and push"
- "I've finished implementing the email functionality, commit in chunks and push when builds are successful"
- "I've added the blog system and UI components, please use git-commit-manager to handle the commits"
- "I've made several changes across different parts of the codebase, commit them properly"

## Agent Flow

When triggered, Claude Code will:

1. **Analyze the changes** using `commit-analyzer.js`
2. **Group files logically** based on the configured rules
3. **Generate conventional commit messages** with proper scopes
4. **Create commits** in the optimal order
5. **Run tests/build** if configured
6. **Push changes** if everything passes
7. **Report results** back to the user

## Configuration Files

### Primary Config: `config.json`
Contains all the agent's behavior rules:
- Commit conventions (types, scopes)
- Chunking rules (max files, logical groups)
- Build/test commands
- Push strategy

### Scripts
- `commit-analyzer.js` - Analyzes changes and suggests commit strategy
- `auto-commit.js` - Executes the commit workflow
- `pre-commit.js` - Pre-commit hooks and validation

## Logical Groupings for WebCloudor

The agent recognizes these project-specific patterns:

1. **API Changes**: `src/app/api/**`, `src/lib/api/**`
   - Backend routes, models, database utilities
   - Commit type: `feat(api)` or `fix(api)`

2. **UI Components**: `src/components/**`, `components/**`
   - React components, UI elements
   - Commit type: `feat(ui)` or `style(ui)`

3. **Email System**: `lib/resend.ts`, email APIs, newsletter components
   - Email templates, notifications, newsletter
   - Commit type: `feat(email)` or `fix(email)`

4. **Blog System**: `**/blog/**`, `sanity/**`
   - Blog components, CMS integration, content
   - Commit type: `feat(blog)` or `fix(blog)`

5. **Configuration**: `*.config.*`, `package.json`, `tsconfig.json`
   - Project setup, dependencies, build config
   - Commit type: `build(config)` or `chore(deps)`

6. **Styling**: `**/*.css`, `**/globals.css`
   - CSS, Tailwind, visual design
   - Commit type: `style` or `feat(ui)`

## Example Agent Interaction

**User:** "I've implemented the complete newsletter system with email templates, subscription management, and API endpoints. Please use git-commit-manager to commit these changes."

**Claude Response:**
```
I'll use the git-commit-manager agent to handle these newsletter system changes in logical chunks.

*Analyzing 15 changed files...*
*Grouping changes by functionality...*

Creating commits:
1. feat(email): add comprehensive Resend email service integration
2. feat(api): add newsletter subscription and management endpoints  
3. feat(ui): add newsletter forms and subscription components
4. build(deps): add email service dependencies

*Running tests... ✅*
*Building project... ✅*  
*Pushing to remote... ✅*

Successfully committed newsletter system in 4 logical commits and pushed to remote!
```

## Benefits for WebCloudor Development

1. **Clean History**: Each feature gets proper commit messages
2. **Code Review**: Logical chunks make PR reviews easier
3. **Rollback**: Easy to revert specific functionality
4. **Collaboration**: Team members can understand change scope
5. **CI/CD**: Proper commits trigger appropriate build pipelines

## Customization

The agent can be customized for different project needs:

### Add Custom Scopes
```json
{
  "commitConventions": {
    "scopes": ["seo", "performance", "analytics", "security"]
  }
}
```

### Modify Chunking Rules  
```json
{
  "chunkingRules": {
    "maxFilesPerCommit": 8,
    "separateByType": {
      "tests": true,
      "docs": true
    }
  }
}
```

### Custom Build Commands
```json
{
  "buildCommand": "npm run build && npm run test:e2e",
  "testCommand": "npm run lint && npm run type-check"
}
```

## Error Handling

The agent handles common scenarios:

- **Build Failures**: Commits created but not pushed
- **Test Failures**: User notified, manual fix required  
- **No Changes**: Graceful message about clean working tree
- **Large Changes**: Automatic chunking into smaller commits

## Integration Status

✅ **Agent Configuration** - Complete  
✅ **File Analysis** - Logical grouping implemented  
✅ **Commit Generation** - Conventional commits with proper scopes  
✅ **Build Integration** - Test and build validation  
✅ **Push Strategy** - Configurable push behavior  
✅ **Error Handling** - Comprehensive error scenarios  

The git-commit-manager agent is ready for use with Claude Code!