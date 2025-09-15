# 🏠 Local Publishing Guide - Complete Manual Process

This guide covers publishing your VS Code extension entirely from your local machine without GitHub Actions automation.

## 🔧 Prerequisites

Make sure you have these installed and configured:

- [ ] **Node.js** (v18+): `node --version`
- [ ] **Git**: `git --version`
- [ ] **VS Code**: For testing your extension

## 📋 Pre-Publishing Setup

### 1. Install Required Tools

```bash
# Install VS Code Extension CLI tool globally
npm install -g @vscode/vsce

# Install Open VSX CLI tool (optional, for Open VSX publishing)
npm install -g ovsx

# Verify installations
vsce --version
ovsx --version
```

### 2. Create Required Accounts

#### GitHub Account
- Already have: ✅ (marianfoo)

#### VS Code Marketplace Publisher Account
1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft/GitHub account
3. Create a publisher profile:
   - **Publisher ID**: `MarianZeis` (matches your package.json)
   - **Display Name**: `Marian Zeis` (or your preferred display name)
   - **Description**: Brief description about you/your extensions

#### Azure DevOps Personal Access Token (PAT)
1. Go to [Azure DevOps](https://dev.azure.com)
2. Sign in with the same Microsoft account
3. Click your profile picture → "Personal access tokens"
4. Click "New Token":
   - **Name**: "VS Code Extension Publishing"
   - **Organization**: "All accessible organizations"
   - **Expiration**: 1 year (or your preference)
   - **Scopes**: Custom defined → Check **"Marketplace (Manage)"**
5. **IMPORTANT**: Copy and save this token securely!

#### Open VSX Account (Optional)
1. Go to [Open VSX Registry](https://open-vsx.org/)
2. Sign in with GitHub
3. Get your access token from your profile

## 🚀 Step-by-Step Local Publishing Process

### Phase 1: Prepare Your Extension

#### Step 1: Final Code Review

```bash
# Navigate to your extension directory
cd /Users/marianzeis/DEV/vsc-extension-opendebugterminal

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run any tests (if you have them)
npm test
```

#### Step 2: Update Version and Changelog

```bash
# Check current version
grep '"version"' package.json

# If you need to bump version (example for patch release):
npm version patch
# Or for minor: npm version minor
# Or for major: npm version major

# Update CHANGELOG.md with today's date
# Replace "2025-01-XX" with actual date like "2025-01-15"
```

#### Step 3: Build and Test Package

```bash
# Package the extension
npm run package

# This creates: open-js-debug-terminal-here-X.X.X.vsix

# Test the package by installing it locally in VS Code
code --install-extension open-js-debug-terminal-here-*.vsix

# Test the extension functionality in VS Code
# Then uninstall the test version:
code --uninstall-extension MarianZeis.open-js-debug-terminal-here
```

### Phase 2: GitHub Repository Setup

#### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial release: Open in JavaScript Debug Terminal extension"

# Create repository on GitHub.com manually:
# 1. Go to https://github.com/new
# 2. Repository name: "vsc-ext-debugterminal" (matches your URLs)
# 3. Description: "VS Code extension that adds 'Open in JavaScript Debug Terminal' to context menus"
# 4. Public repository
# 5. Don't initialize with README/gitignore (you have them)

# Add remote and push
git remote add origin https://github.com/marianfoo/vsc-ext-debugterminal.git
git branch -M main
git push -u origin main
```

#### Step 2: Create GitHub Release

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# Then manually create release on GitHub:
# 1. Go to: https://github.com/marianfoo/vsc-ext-debugterminal/releases
# 2. Click "Create a new release"
# 3. Choose tag: v1.0.0
# 4. Release title: "Release v1.0.0"
# 5. Description: Copy content from CHANGELOG.md
# 6. Attach your .vsix file
# 7. Click "Publish release"
```

### Phase 3: VS Code Marketplace Publishing

#### Step 1: Login to Publisher Account

```bash
# Login with your publisher ID
vsce login MarianZeis

# It will prompt for your Personal Access Token
# Enter the PAT you created earlier
```

#### Step 2: Validate Before Publishing

```bash
# Validate your package without publishing
vsce package --no-dependencies

# Preview what will be published
vsce show
```

#### Step 3: Publish to Marketplace

```bash
# Publish the extension
vsce publish

# Or publish with specific version
vsce publish 1.0.0

# Or publish the pre-built VSIX file
vsce publish open-js-debug-terminal-here-1.0.0.vsix
```

### Phase 4: Open VSX Publishing (Optional)

#### Step 1: Login to Open VSX

```bash
# Login with your access token
ovsx login [YOUR_OPEN_VSX_TOKEN]
```

#### Step 2: Publish to Open VSX

```bash
# Publish using the same VSIX file
ovsx publish open-js-debug-terminal-here-1.0.0.vsix

# Or publish directly
ovsx publish
```

## 🔄 Future Updates Workflow

For subsequent releases, follow this streamlined process:

### 1. Update Your Extension

```bash
# Make your code changes
# Update CHANGELOG.md with new changes
# Test your changes thoroughly
```

### 2. Prepare New Release

```bash
# Bump version
npm version patch  # or minor/major

# Compile and package
npm run compile
npm run package
```

### 3. Commit and Tag

```bash
# Commit changes
git add .
git commit -m "Release v1.0.1: [Brief description of changes]"

# Tag the release
git tag v1.0.1
git push origin main --tags
```

### 4. Publish Updates

```bash
# Update GitHub release manually (upload new VSIX)

# Publish to VS Code Marketplace
vsce publish

# Publish to Open VSX (if using)
ovsx publish
```

## 📊 Verification Steps

After publishing, verify everything worked:

### Check VS Code Marketplace
1. Go to [VS Code Marketplace](https://marketplace.visualstudio.com/)
2. Search for "Open in JavaScript Debug Terminal"
3. Verify your extension appears with correct details

### Test Installation
```bash
# Install from marketplace
code --install-extension MarianZeis.open-js-debug-terminal-here

# Test functionality
# Right-click folder in VS Code Explorer
# Verify "Open in JavaScript Debug Terminal" appears
```

### Check Analytics
1. Go to [Publisher Management Portal](https://marketplace.visualstudio.com/manage)
2. View your extension's analytics and downloads

## 🛠️ Troubleshooting Common Issues

### Authentication Problems

**"Authentication failed" with vsce:**
```bash
# Re-login with fresh token
vsce logout
vsce login MarianZeis

# Verify token has correct permissions in Azure DevOps
```

**"Publisher not found":**
- Verify publisher ID in package.json matches your marketplace publisher ID
- Check that you've created the publisher profile correctly

### Publishing Errors

**"Extension already exists with this version":**
```bash
# Bump version number
npm version patch
npm run package
vsce publish
```

**"Invalid publisher" in package.json:**
- Ensure `"publisher": "MarianZeis"` exactly matches your marketplace publisher ID

### Package Issues

**Missing files in VSIX:**
- Check `.vscodeignore` - ensure you're not excluding required files
- Verify all necessary files are in your repository

**Large package size:**
```bash
# Check what's included
vsce ls

# Add items to .vscodeignore to reduce size:
# node_modules/, src/, *.ts files, etc.
```

## 🎯 Quick Reference Commands

```bash
# Complete local publishing workflow
npm install
npm run compile
npm run package
git add . && git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
vsce publish
ovsx publish  # optional
```

## 📝 Publishing Checklist

Use this checklist for each release:

- [ ] Code changes completed and tested
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated with new version and date
- [ ] `npm run compile` successful
- [ ] `npm run package` successful
- [ ] Local testing in VS Code completed
- [ ] Git commit and tag created
- [ ] Code pushed to GitHub
- [ ] GitHub release created with VSIX attached
- [ ] Published to VS Code Marketplace
- [ ] Published to Open VSX (if applicable)
- [ ] Installation from marketplace tested
- [ ] Extension functionality verified

## 🎉 Congratulations!

Your extension is now published and available to millions of VS Code users!

### Next Steps:
- Monitor marketplace analytics
- Respond to user reviews and feedback
- Plan future features and updates
- Share your extension on social media

---

**Happy Publishing! 🚀**
