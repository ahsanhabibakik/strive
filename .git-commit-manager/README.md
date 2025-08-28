# Git Commit Manager for WebCloudor

This folder contains configuration and automation for the git-commit-manager agent that handles intelligent commit chunking and automated git workflows.

## Features

- **Intelligent Commit Chunking**: Automatically groups related changes into logical commits
- **Conventional Commits**: Enforces consistent commit message format
- **Build Integration**: Runs tests and builds before pushing
- **Scope-based Organization**: Groups changes by feature area (ui, api, blog, email, etc.)
- **Automated Workflow**: Handles the entire commit → build → test → push cycle

## Configuration

The `config.json` file defines:

### Chunking Rules
- Maximum 10 files or 500 lines per commit
- Groups by file type, feature, and scope
- Separates new files, modifications, and deletions
- Logical groupings for related functionality

### Commit Conventions
- Uses conventional commit format: `type(scope): description`
- Supported types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- Scopes: ui, api, blog, email, auth, cms, newsletter, contact, components, utils, config, deps

### Build & Test Integration
- Runs `npm run build` before pushing
- Executes `npm run lint` for code quality
- Only pushes if build and tests pass

## Logical Groups

The system recognizes these logical groups:

1. **API Changes** - Backend routes, models, utilities (`src/app/api/**`, `src/lib/api/**`)
2. **UI Components** - React components (`src/components/**`, `components/**`)
3. **Email System** - Email templates, newsletter (`lib/resend.ts`, email APIs)
4. **Blog System** - Blog components, CMS (`**/blog/**`, `sanity/**`)
5. **Configuration** - Config files, dependencies (`*.config.*`, `package.json`)
6. **Styling** - CSS and styling (`**/*.css`, `**/styles/**`)

## Usage

When you need to commit multiple changes, simply use the git-commit-manager agent:

```
I've completed the user authentication system with login, logout, and session management
```

The agent will:
1. Analyze all changed files
2. Group them into logical commits
3. Create appropriate commit messages
4. Run build and tests
5. Push if everything passes

## Commit Message Template

```
feat(auth): add user authentication system

- Implement login/logout functionality
- Add session management
- Create protected route middleware
- Add user profile components

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Benefits

- **Consistent History**: Clean, logical commit history
- **Automated Quality**: No commits without passing tests
- **Reduced Errors**: Automated workflow prevents manual mistakes
- **Better Reviews**: Logical chunks make code review easier
- **Team Workflow**: Standardized process for all contributors