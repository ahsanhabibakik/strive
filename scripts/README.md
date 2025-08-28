# WebCloudor Git Scripts

This directory contains helpful scripts for managing Git commits in the WebCloudor project.

## Chunk-by-Chunk Commit Scripts

### Purpose
These scripts help you commit files individually with meaningful, human-like commit messages, increasing your commit frequency while maintaining good Git history.

### Available Scripts

#### 1. Bash Script (Linux/macOS/Git Bash)
```bash
./scripts/chunk-commit.sh interactive  # Interactive mode
./scripts/chunk-commit.sh auto         # Auto mode
```

#### 2. PowerShell Script (Windows)
```powershell
.\scripts\chunk-commit.ps1 interactive  # Interactive mode
.\scripts\chunk-commit.ps1 auto         # Auto mode
```

### Features

#### Interactive Mode
- Lists all modified and untracked files
- Prompts for each file individually
- Suggests contextual commit messages based on file type
- Allows custom commit messages
- Shows progress and final commit history

#### Auto Mode
- Automatically groups similar file types
- Uses intelligent commit messages
- Good for quick commits of related changes

### Commit Message Templates

The scripts automatically generate human-like commit messages based on file types:

**Components:**
```
Add [filename] component with enhanced user experience

- Implemented responsive design with mobile-first approach
- Added smooth animations using Framer Motion
- Includes proper TypeScript interfaces and error handling
```

**API Routes:**
```
Implement [filename] API endpoint with robust validation

- Added comprehensive input validation using Zod schemas
- Implemented proper error handling and status codes
- Includes rate limiting and security middleware
```

**Pages:**
```
Create [filename] page with optimized performance

- Built server-side rendered page for better SEO
- Integrated with existing design system components
- Optimized for Core Web Vitals and accessibility
```

**Styling:**
```
Update styling for improved visual consistency

- Enhanced [filename] with Tailwind CSS utilities
- Improved responsive behavior across all device sizes
- Maintained design system color palette and typography
```

**Configuration:**
```
Configure [filename] for better development workflow

- Updated configuration to improve build performance
- Added proper TypeScript support and linting rules
- Enhanced developer experience with better tooling
```

**Documentation:**
```
Update documentation for [filename]

- Improved clarity and added practical examples
- Updated to reflect current implementation
- Better organization for developer reference
```

### Git Configuration

The scripts use your existing Git configuration:
- **User:** delwerhossain
- **Email:** delwerhossain006@gmail.com

### Usage Examples

#### Starting an Interactive Session
```bash
# Using Bash (recommended for Git Bash on Windows)
./scripts/chunk-commit.sh interactive

# Using PowerShell
.\scripts\chunk-commit.ps1 interactive
```

#### Quick Auto-Commit
```bash
# Using Bash
./scripts/chunk-commit.sh auto

# Using PowerShell
.\scripts\chunk-commit.ps1 auto
```

### Benefits

1. **Increased Commit Frequency:** More granular commits improve project history
2. **Better Commit Messages:** Consistent, descriptive messages that explain changes
3. **Improved Workflow:** Interactive mode helps review changes before committing
4. **Team Consistency:** Standardized commit message format across the project

### Tips for Best Results

1. **Use Interactive Mode** when you want control over individual commits
2. **Use Auto Mode** for quick commits of similar file types
3. **Review Changes** before committing with `git diff`
4. **Push Regularly** to keep your remote repository updated
5. **Follow Patterns** established by the script for manual commits

### File Type Detection

The scripts automatically detect file types and choose appropriate commit messages:

- **Components:** Files in `components/` or containing "component"
- **API Routes:** Files in `api/` directories
- **Pages:** Files matching `app/*/page.*` pattern
- **Styles:** Files with `.css`, `.scss` extensions or containing "style"
- **Config:** Files with "config" in name or `.config.*` pattern
- **Docs:** Files in `doc/` or with `.md` extension

### Integration with WebCloudor Workflow

These scripts align with the WebCloudor development guidelines:
- Follows the project's commit message standards
- Supports the modular architecture approach
- Maintains consistency with the documentation structure
- Helps track changes to critical business files

Remember: This is a business-critical website for client acquisition, so every commit should reflect professional development practices.
