# Git Commit Manager Usage Examples

## Basic Usage with Claude Code

When you have multiple changes and want to commit them intelligently, simply tell Claude:

```
I've completed the user authentication system with login, logout, and session management. Please use the git-commit-manager to handle the commits.
```

Claude will then use the git-commit-manager agent to:
1. Analyze your changes
2. Group them logically
3. Create appropriate commit messages
4. Run tests and build
5. Push if everything passes

## Manual Usage

### Analyze Changes
```bash
cd .git-commit-manager
npm run analyze
```

### Auto-commit All Changes
```bash
cd .git-commit-manager
npm run commit
```

### Interactive Mode
```bash
cd .git-commit-manager
npm run commit:interactive
```

## Example Scenarios

### Scenario 1: New Feature Implementation
**Changes:**
- `src/components/auth/LoginForm.tsx` (new)
- `src/components/auth/LogoutButton.tsx` (new)
- `src/app/api/auth/route.ts` (new)
- `src/lib/auth.ts` (modified)
- `package.json` (modified)

**Generated Commits:**
1. `feat(ui): add authentication components`
2. `feat(api): add authentication endpoints`
3. `feat(auth): update authentication utilities`
4. `build(deps): add authentication dependencies`

### Scenario 2: Bug Fixes and Improvements
**Changes:**
- `src/components/blog/BlogCard.tsx` (modified)
- `src/app/api/newsletter/route.ts` (modified)
- `lib/resend.ts` (modified)
- `README.md` (modified)

**Generated Commits:**
1. `fix(blog): improve BlogCard component`
2. `fix(api): fix newsletter API endpoints`
3. `fix(email): update email service`
4. `docs: update README documentation`

### Scenario 3: Large Refactoring
**Changes:**
- 15 component files (modified)
- 8 API files (modified)
- 5 utility files (modified)
- Config files (modified)

**Generated Commits:**
1. `refactor(ui): update component architecture`
2. `refactor(api): restructure API endpoints`
3. `refactor(utils): improve utility functions`
4. `build(config): update project configuration`

## Configuration Examples

### Custom Commit Types
```json
{
  "commitConventions": {
    "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "hotfix"]
  }
}
```

### Custom Scopes
```json
{
  "commitConventions": {
    "scopes": ["ui", "api", "blog", "email", "auth", "cms", "newsletter", "contact", "components", "utils", "config", "deps", "seo", "performance"]
  }
}
```

### Custom Chunking Rules
```json
{
  "chunkingRules": {
    "maxFilesPerCommit": 5,
    "maxLinesPerCommit": 300,
    "groupBy": ["fileType", "feature", "scope"]
  }
}
```

## Integration with CI/CD

The git-commit-manager can be integrated with your CI/CD pipeline:

```yaml
# .github/workflows/commit-check.yml
name: Commit Quality Check
on: [push, pull_request]

jobs:
  validate-commits:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check commit messages
        run: |
          cd .git-commit-manager
          node scripts/commit-analyzer.js --validate
```

## Benefits

1. **Consistent History**: All commits follow conventional format
2. **Logical Grouping**: Related changes are grouped together
3. **Automated Quality**: Tests and builds run before pushing
4. **Reduced Errors**: Automated workflow prevents manual mistakes
5. **Better Reviews**: Logical chunks make code review easier
6. **Team Workflow**: Standardized process for all contributors

## Troubleshooting

### Common Issues

1. **"Config file not found"**
   - Ensure you're running commands from the `.git-commit-manager` directory
   - Verify `config.json` exists and is valid JSON

2. **"No changed files detected"**
   - Run `git status` to check for changes
   - Ensure files are not already staged incorrectly

3. **Build/Test failures**
   - Fix the issues before committing
   - Or temporarily disable in config: `"requireBuild": false`

### Debug Mode
```bash
node scripts/commit-analyzer.js --json
```

This outputs detailed analysis in JSON format for debugging.