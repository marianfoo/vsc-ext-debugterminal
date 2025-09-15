#!/bin/bash

# 🚀 Local Publishing Script for VS Code Extension
# This script automates the local publishing process

set -e  # Exit on any error

echo "🚀 Starting local publishing process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Node.js version (require 20+)
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js 20+ is required (current: $(node -v))"
        print_error "Please update Node.js: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    if ! command -v vsce &> /dev/null; then
        print_warning "vsce is not installed. Installing globally..."
        npm install -g @vscode/vsce
    fi
    
    print_success "All dependencies are available"
}

# Get current version from package.json
get_current_version() {
    node -p "require('./package.json').version"
}

# Ask user for version bump type
ask_version_bump() {
    echo ""
    print_step "Current version: $(get_current_version)"
    echo ""
    echo "Select version bump type:"
    echo "1) Patch (1.0.0 → 1.0.1) - Bug fixes"
    echo "2) Minor (1.0.0 → 1.1.0) - New features"
    echo "3) Major (1.0.0 → 2.0.0) - Breaking changes"
    echo "4) Skip version bump"
    echo ""
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1) npm version patch ;;
        2) npm version minor ;;
        3) npm version major ;;
        4) echo "Skipping version bump" ;;
        *) print_error "Invalid choice. Exiting."; exit 1 ;;
    esac
}

# Build and test
build_and_test() {
    print_step "Installing dependencies..."
    npm install
    
    print_step "Compiling TypeScript..."
    npm run compile
    
    print_step "Running tests..."
    npm test || print_warning "Tests failed or not configured"
    
    print_step "Packaging extension..."
    npm run package
    
    print_success "Build completed successfully"
}

# Git operations
git_operations() {
    local version=$(get_current_version)
    
    print_step "Committing changes..."
    git add .
    git commit -m "Release v${version}" || print_warning "No changes to commit"
    
    print_step "Creating git tag..."
    git tag "v${version}" || print_warning "Tag already exists"
    
    print_step "Pushing to GitHub..."
    git push origin main --tags
    
    print_success "Git operations completed"
}

# Publish to VS Code Marketplace
publish_marketplace() {
    print_step "Publishing to VS Code Marketplace..."
    
    # Check if logged in
    if ! vsce ls-publishers &> /dev/null; then
        print_warning "Not logged in to VS Code Marketplace"
        echo "Please run: vsce login MarianZeis"
        echo "Enter your Personal Access Token when prompted"
        read -p "Press Enter after logging in..."
    fi
    
    print_step "Publishing to marketplace..."
    vsce publish
    
    print_success "Published to VS Code Marketplace!"
}

# Publish to Open VSX (optional)
publish_openvsx() {
    read -p "Do you want to publish to Open VSX Registry? (y/N): " publish_ovsx
    
    if [[ $publish_ovsx =~ ^[Yy]$ ]]; then
        if ! command -v ovsx &> /dev/null; then
            print_warning "ovsx CLI not found. Installing..."
            npm install -g ovsx
        fi
        
        print_step "Publishing to Open VSX..."
        ovsx publish || print_warning "Open VSX publish failed (might need login: ovsx login [token])"
    fi
}

# Create GitHub release
create_github_release() {
    local version=$(get_current_version)
    
    print_step "GitHub Release Instructions:"
    echo "1. Go to: https://github.com/marianfoo/vsc-ext-debugterminal/releases"
    echo "2. Click 'Create a new release'"
    echo "3. Tag: v${version}"
    echo "4. Title: Release v${version}"
    echo "5. Upload the .vsix file: $(ls *.vsix | head -1)"
    echo "6. Copy description from CHANGELOG.md"
    
    read -p "Press Enter when GitHub release is created..."
}

# Verification steps
verify_publication() {
    print_step "Verification steps:"
    echo "1. Check VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=MarianZeis.open-js-debug-terminal-here"
    echo "2. Test installation: code --install-extension MarianZeis.open-js-debug-terminal-here"
    echo "3. Check your publisher dashboard: https://marketplace.visualstudio.com/manage"
    
    print_success "Publishing process completed! 🎉"
}

# Main function
main() {
    echo "🚀 VS Code Extension Local Publishing Script"
    echo "Extension: Open in JavaScript Debug Terminal"
    echo "Publisher: MarianZeis"
    echo "Repository: https://github.com/marianfoo/vsc-ext-debugterminal"
    echo ""
    
    check_dependencies
    ask_version_bump
    build_and_test
    git_operations
    publish_marketplace
    publish_openvsx
    create_github_release
    verify_publication
    
    echo ""
    print_success "🎉 All done! Your extension has been published successfully!"
    echo ""
    echo "📊 Next steps:"
    echo "- Monitor your extension's analytics"
    echo "- Respond to user reviews and feedback"
    echo "- Plan future updates and features"
}

# Run main function
main "$@"
