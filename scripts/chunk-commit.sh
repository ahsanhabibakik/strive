#!/bin/bash

# WebCloudor Chunk-by-Chunk Commit Script
# Usage: ./scripts/chunk-commit.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 WebCloudor Chunk-by-Chunk Commit Helper${NC}"
echo -e "${BLUE}===========================================${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check git configuration
echo -e "${YELLOW}📋 Current Git Configuration:${NC}"
echo "User: $(git config user.name) <$(git config user.email)>"
echo ""

# Show current status
echo -e "${YELLOW}📊 Current Git Status:${NC}"
git status --short
echo ""

# Function to commit a single file/directory
commit_chunk() {
    local file_path="$1"
    local commit_message="$2"
    
    echo -e "${BLUE}📁 Adding: ${file_path}${NC}"
    git add "$file_path"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Committing with message: ${commit_message}${NC}"
        git commit -m "$commit_message"
        echo ""
    else
        echo -e "${RED}❌ Failed to add ${file_path}${NC}"
    fi
}

# Example commit messages for different types of changes
get_commit_message() {
    local file_type="$1"
    local file_name="$2"
    
    case $file_type in
        "component")
            echo "Add ${file_name} component with enhanced user experience

- Implemented responsive design with mobile-first approach
- Added smooth animations using Framer Motion
- Includes proper TypeScript interfaces and error handling"
            ;;
        "api")
            echo "Implement ${file_name} API endpoint with robust validation

- Added comprehensive input validation using Zod schemas
- Implemented proper error handling and status codes
- Includes rate limiting and security middleware"
            ;;
        "page")
            echo "Create ${file_name} page with optimized performance

- Built server-side rendered page for better SEO
- Integrated with existing design system components
- Optimized for Core Web Vitals and accessibility"
            ;;
        "style")
            echo "Update styling for improved visual consistency

- Enhanced ${file_name} with Tailwind CSS utilities
- Improved responsive behavior across all device sizes
- Maintained design system color palette and typography"
            ;;
        "config")
            echo "Configure ${file_name} for better development workflow

- Updated configuration to improve build performance
- Added proper TypeScript support and linting rules
- Enhanced developer experience with better tooling"
            ;;
        "docs")
            echo "Update documentation for ${file_name}

- Improved clarity and added practical examples
- Updated to reflect current implementation
- Better organization for developer reference"
            ;;
        *)
            echo "Update ${file_name} with improvements

- Enhanced functionality and user experience
- Improved code quality and maintainability
- Added proper error handling and validation"
            ;;
    esac
}

# Interactive mode
if [ "$1" = "--interactive" ] || [ "$1" = "-i" ]; then
    echo -e "${YELLOW}🔄 Interactive Mode: Commit files one by one${NC}"
    
    # Get list of changed files
    changed_files=($(git diff --name-only --cached 2>/dev/null))
    unstaged_files=($(git diff --name-only 2>/dev/null))
    untracked_files=($(git ls-files --others --exclude-standard 2>/dev/null))
    
    all_files=("${unstaged_files[@]}" "${untracked_files[@]}")
    
    if [ ${#all_files[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ No files to commit. Working tree is clean!${NC}"
        exit 0
    fi
    
    echo -e "${YELLOW}📁 Files available for commit:${NC}"
    for i in "${!all_files[@]}"; do
        echo "$((i+1)). ${all_files[$i]}"
    done
    echo ""
    
    for file in "${all_files[@]}"; do
        echo -e "${BLUE}📝 Process file: ${file}?${NC}"
        read -p "Commit this file? (y/n/s=skip): " choice
        
        case $choice in
            [Yy]* )
                # Determine file type for better commit message
                if [[ $file == *"component"* ]] || [[ $file == *"src/components"* ]]; then
                    file_type="component"
                elif [[ $file == *"api"* ]] || [[ $file == *"/api/"* ]]; then
                    file_type="api"
                elif [[ $file == *"page"* ]] || [[ $file == *"app/"*"/page."* ]]; then
                    file_type="page"
                elif [[ $file == *".css"* ]] || [[ $file == *"style"* ]]; then
                    file_type="style"
                elif [[ $file == *"config"* ]] || [[ $file == *".config."* ]]; then
                    file_type="config"
                elif [[ $file == *"doc/"* ]] || [[ $file == *".md"* ]]; then
                    file_type="docs"
                else
                    file_type="general"
                fi
                
                filename=$(basename "$file")
                default_message=$(get_commit_message "$file_type" "$filename")
                
                echo -e "${YELLOW}📝 Default commit message:${NC}"
                echo "$default_message"
                echo ""
                
                read -p "Use this message? (y/n): " use_default
                
                if [[ $use_default =~ ^[Yy]$ ]]; then
                    commit_chunk "$file" "$default_message"
                else
                    echo "Enter custom commit message:"
                    read -r custom_message
                    commit_chunk "$file" "$custom_message"
                fi
                ;;
            [Ss]* )
                echo -e "${YELLOW}⏭️  Skipping ${file}${NC}"
                ;;
            * )
                echo -e "${YELLOW}⏭️  Skipping ${file}${NC}"
                ;;
        esac
        echo ""
    done
    
    echo -e "${GREEN}🎉 Chunk-by-chunk commit process completed!${NC}"
    git log --oneline -5
    
elif [ "$1" = "--auto" ] || [ "$1" = "-a" ]; then
    echo -e "${YELLOW}🤖 Auto Mode: Committing files automatically${NC}"
    
    # Auto-commit common file patterns
    if [ -n "$(git diff --name-only | grep -E '\.(tsx?|jsx?)$')" ]; then
        git add . && git commit -m "Update React components and TypeScript files

- Enhanced component functionality and type safety
- Improved user experience with better interactions
- Maintained consistent code style and best practices"
    fi
    
    if [ -n "$(git diff --name-only | grep -E '\.(css|scss)$')" ]; then
        git add . && git commit -m "Refine styling and responsive design

- Updated CSS for better visual consistency
- Improved mobile responsiveness and accessibility
- Enhanced user interface components"
    fi
    
    if [ -n "$(git diff --name-only | grep -E '\.md$')" ]; then
        git add . && git commit -m "Update project documentation

- Improved clarity and added helpful examples
- Updated development guidelines and best practices
- Better organization for team reference"
    fi
    
else
    echo -e "${YELLOW}📖 Usage:${NC}"
    echo "  ./scripts/chunk-commit.sh --interactive  # Interactive file-by-file commits"
    echo "  ./scripts/chunk-commit.sh --auto        # Auto-commit with smart messages"
    echo ""
    echo -e "${YELLOW}💡 Tip:${NC} Use interactive mode for better control over individual commits"
fi

echo -e "${BLUE}✨ Happy coding with WebCloudor! ✨${NC}"
