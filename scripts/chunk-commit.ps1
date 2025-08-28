# WebCloudor Chunk-by-Chunk Commit Script (PowerShell)
# Usage: .\scripts\chunk-commit.ps1

param(
    [string]$Mode = "help"
)

# Colors for output
$colors = @{
    Green = "Green"
    Blue = "Cyan" 
    Yellow = "Yellow"
    Red = "Red"
}

function Write-ColorText {
    param($Text, $Color)
    Write-Host $Text -ForegroundColor $colors[$Color]
}

Write-ColorText "🚀 WebCloudor Chunk-by-Chunk Commit Helper" "Blue"
Write-ColorText "==========================================" "Blue"

# Check if we're in a git repository
try {
    git rev-parse --git-dir | Out-Null
} catch {
    Write-ColorText "❌ Error: Not in a git repository" "Red"
    exit 1
}

# Check git configuration
Write-ColorText "📋 Current Git Configuration:" "Yellow"
$gitUser = git config user.name
$gitEmail = git config user.email
Write-Host "User: $gitUser <$gitEmail>"
Write-Host ""

# Show current status
Write-ColorText "📊 Current Git Status:" "Yellow"
git status --short
Write-Host ""

function Get-CommitMessage {
    param($FileType, $FileName)
    
    switch ($FileType) {
        "component" {
            return @"
Add $FileName component with enhanced user experience

- Implemented responsive design with mobile-first approach
- Added smooth animations using Framer Motion
- Includes proper TypeScript interfaces and error handling
"@
        }
        "api" {
            return @"
Implement $FileName API endpoint with robust validation

- Added comprehensive input validation using Zod schemas
- Implemented proper error handling and status codes
- Includes rate limiting and security middleware
"@
        }
        "page" {
            return @"
Create $FileName page with optimized performance

- Built server-side rendered page for better SEO
- Integrated with existing design system components
- Optimized for Core Web Vitals and accessibility
"@
        }
        "style" {
            return @"
Update styling for improved visual consistency

- Enhanced $FileName with Tailwind CSS utilities
- Improved responsive behavior across all device sizes
- Maintained design system color palette and typography
"@
        }
        "config" {
            return @"
Configure $FileName for better development workflow

- Updated configuration to improve build performance
- Added proper TypeScript support and linting rules
- Enhanced developer experience with better tooling
"@
        }
        "docs" {
            return @"
Update documentation for $FileName

- Improved clarity and added practical examples
- Updated to reflect current implementation
- Better organization for developer reference
"@
        }
        default {
            return @"
Update $FileName with improvements

- Enhanced functionality and user experience
- Improved code quality and maintainability
- Added proper error handling and validation
"@
        }
    }
}

function Commit-Chunk {
    param($FilePath, $CommitMessage)
    
    Write-ColorText "📁 Adding: $FilePath" "Blue"
    git add $FilePath
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorText "✅ Committing with message: $CommitMessage" "Green"
        git commit -m $CommitMessage
        Write-Host ""
    } else {
        Write-ColorText "❌ Failed to add $FilePath" "Red"
    }
}

switch ($Mode) {
    "interactive" {
        Write-ColorText "🔄 Interactive Mode: Commit files one by one" "Yellow"
        
        # Get list of changed files
        $unstagedFiles = git diff --name-only
        $untrackedFiles = git ls-files --others --exclude-standard
        $allFiles = $unstagedFiles + $untrackedFiles | Where-Object { $_ -ne "" }
        
        if ($allFiles.Count -eq 0) {
            Write-ColorText "✅ No files to commit. Working tree is clean!" "Green"
            exit 0
        }
        
        Write-ColorText "📁 Files available for commit:" "Yellow"
        for ($i = 0; $i -lt $allFiles.Count; $i++) {
            Write-Host "$($i+1). $($allFiles[$i])"
        }
        Write-Host ""
        
        foreach ($file in $allFiles) {
            Write-ColorText "📝 Process file: $file?" "Blue"
            $choice = Read-Host "Commit this file? (y/n/s=skip)"
            
            switch ($choice.ToLower()) {
                { $_ -in @("y", "yes") } {
                    # Determine file type for better commit message
                    $fileType = "general"
                    if ($file -match "component|src/components") { $fileType = "component" }
                    elseif ($file -match "api|/api/") { $fileType = "api" }
                    elseif ($file -match "page|app/.*/page\.") { $fileType = "page" }
                    elseif ($file -match "\.css|style") { $fileType = "style" }
                    elseif ($file -match "config|\.config\.") { $fileType = "config" }
                    elseif ($file -match "doc/|\.md") { $fileType = "docs" }
                    
                    $fileName = Split-Path $file -Leaf
                    $defaultMessage = Get-CommitMessage $fileType $fileName
                    
                    Write-ColorText "📝 Default commit message:" "Yellow"
                    Write-Host $defaultMessage
                    Write-Host ""
                    
                    $useDefault = Read-Host "Use this message? (y/n)"
                    
                    if ($useDefault.ToLower() -in @("y", "yes")) {
                        Commit-Chunk $file $defaultMessage
                    } else {
                        $customMessage = Read-Host "Enter custom commit message"
                        Commit-Chunk $file $customMessage
                    }
                }
                { $_ -in @("s", "skip") } {
                    Write-ColorText "⏭️  Skipping $file" "Yellow"
                }
                default {
                    Write-ColorText "⏭️  Skipping $file" "Yellow"
                }
            }
            Write-Host ""
        }
        
        Write-ColorText "🎉 Chunk-by-chunk commit process completed!" "Green"
        git log --oneline -5
    }
    
    "auto" {
        Write-ColorText "🤖 Auto Mode: Committing files automatically" "Yellow"
        
        $tsFiles = git diff --name-only | Where-Object { $_ -match '\.(tsx?|jsx?)$' }
        if ($tsFiles) {
            git add .
            git commit -m @"
Update React components and TypeScript files

- Enhanced component functionality and type safety
- Improved user experience with better interactions
- Maintained consistent code style and best practices
"@
        }
        
        $cssFiles = git diff --name-only | Where-Object { $_ -match '\.(css|scss)$' }
        if ($cssFiles) {
            git add .
            git commit -m @"
Refine styling and responsive design

- Updated CSS for better visual consistency
- Improved mobile responsiveness and accessibility
- Enhanced user interface components
"@
        }
        
        $mdFiles = git diff --name-only | Where-Object { $_ -match '\.md$' }
        if ($mdFiles) {
            git add .
            git commit -m @"
Update project documentation

- Improved clarity and added helpful examples
- Updated development guidelines and best practices
- Better organization for team reference
"@
        }
    }
    
    default {
        Write-ColorText "📖 Usage:" "Yellow"
        Write-Host "  .\scripts\chunk-commit.ps1 interactive  # Interactive file-by-file commits"
        Write-Host "  .\scripts\chunk-commit.ps1 auto        # Auto-commit with smart messages"
        Write-Host ""
        Write-ColorText "💡 Tip:" "Yellow"
        Write-Host " Use interactive mode for better control over individual commits"
    }
}

Write-ColorText "✨ Happy coding with WebCloudor! ✨" "Blue"
