# 📦 Complete Publishing Guide for "Open in JavaScript Debug Terminal"

This guide provides step-by-step instructions to publish your VS Code extension to GitHub, NPM, and the VS Code Marketplace.

## 🔧 Prerequisites

Before publishing, ensure you have:

- [ ] **Node.js** (v18 or higher) installed
- [ ] **Git** installed and configured
- [ ] **GitHub account** created
- [ ] **VS Code Publisher account** created
- [ ] **NPM account** created (optional, if you want to publish as npm package)

## 📋 Pre-Publishing Checklist

### 1. Update Placeholder Values

Replace the following placeholders in your files:

#### In `package.json`:
```json
"publisher": "PLACEHOLDER-PUBLISHER" → "your-actual-publisher-id"
"url": "https://github.com/PLACEHOLDER-USERNAME/..." → "https://github.com/your-username/..."
```

#### In `README.md`:
```markdown
https://github.com/your-username/open-js-debug-terminal
```

#### In `LICENSE`:
```text
[Your Name Here] <[your-email@example.com]> → Your Actual Name <your@email.com>
```

#### In GitHub workflows (`.github/workflows/*.yml`):
```yaml
PLACEHOLDER-PUBLISHER → your-actual-publisher-id
```

### 2. Verify Extension Functionality

```bash
# Test compilation
npm run compile

# Test packaging
npm run package

# Manual testing in VS Code
# Press F5 in VS Code to launch Extension Development Host
```

### 3. Update Version and Changelog

- Update version in `package.json` if needed
- Update the date in `CHANGELOG.md` (replace `2025-01-XX` with actual date)

## 🚀 Publishing Steps

### Phase 1: GitHub Repository Setup

#### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `open-js-debug-terminal`
4. Description: "VS Code extension that adds 'Open in JavaScript Debug Terminal' to context menus"
5. Make it **public** (required for VS Code Marketplace)
6. Don't initialize with README (you already have one)

#### Step 2: Initialize Git and Push Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial release: Open in JavaScript Debug Terminal extension"

# Add GitHub remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/open-js-debug-terminal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Release v1.0.0`
5. Description: Copy from CHANGELOG.md
6. Attach the `.vsix` file from your local build
7. Click "Publish release"

### Phase 2: VS Code Marketplace Publishing

#### Step 1: Create Publisher Account

1. Go to [VS Code Marketplace Management](https://marketplace.visualstudio.com/manage)
2. Sign in with Microsoft/GitHub account
3. Create a new publisher:
   - **Publisher ID**: Choose a unique ID (e.g., `yourname-extensions`)
   - **Display Name**: Your name or company name
   - **Description**: Brief description about you

#### Step 2: Get Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com)
2. Click your profile → "Personal access tokens"
3. Create new token:
   - **Name**: "VS Code Extension Publishing"
   - **Organization**: All accessible organizations
   - **Expiration**: 1 year (or custom)
   - **Scopes**: Custom defined → Check "Marketplace" → "Manage"
4. Copy the token (save it securely!)

#### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add repository secrets:
   - **VSCE_PAT**: Your Personal Access Token from Step 2
   - **OVSX_PAT**: (Optional) Token for Open VSX Registry

#### Step 4: Manual Publishing (First Time)

```bash
# Install VSCE globally
npm install -g @vscode/vsce

# Login to your publisher account
npx @vscode/vsce login YOUR-PUBLISHER-ID
# Enter your PAT when prompted

# Publish the extension
npm run publish

# Or publish manually
npx @vscode/vsce publish
```

#### Step 5: Automatic Publishing Setup

After the first manual publish, future releases will be automatic:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes:
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```
4. GitHub Actions will automatically:
   - Build the extension
   - Create a GitHub release
   - Publish to VS Code Marketplace
   - Publish to Open VSX Registry

### Phase 3: Optional NPM Publishing

If you want to make your extension installable via npm:

#### Step 1: Update package.json

Add npm-specific fields:
```json
{
  "files": [
    "out/**/*",
    "images/**/*",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "bin": {
    "open-js-debug-terminal": "./out/extension.js"
  }
}
```

#### Step 2: Publish to NPM

```bash
# Login to NPM
npm login

# Publish package
npm publish
```

## 🔄 Post-Publishing Tasks

### 1. Verify Publication

- [ ] Check [VS Code Marketplace](https://marketplace.visualstudio.com/) for your extension
- [ ] Install your extension in VS Code to test
- [ ] Verify GitHub release has correct assets

### 2. Monitor and Maintain

- [ ] Watch for user feedback and issues
- [ ] Monitor extension analytics in VS Code Marketplace
- [ ] Plan future updates and features

### 3. Promote Your Extension

- [ ] Share on social media
- [ ] Write a blog post about your extension
- [ ] Submit to relevant communities (Reddit, Discord, etc.)

## 🐛 Troubleshooting

### Common Issues

**"Publisher not found" error:**
- Verify your publisher ID in package.json
- Ensure you're logged into the correct publisher account

**"Extension already exists" error:**
- Check if extension name is already taken
- Consider changing the extension name

**GitHub Actions failing:**
- Verify all secrets are set correctly
- Check that your PAT has correct permissions
- Ensure your package.json has valid publisher ID

**VSIX packaging fails:**
- Run `npm run compile` first
- Check for TypeScript errors
- Verify all required files are present

### Getting Help

- **VS Code Extension API**: [Official Documentation](https://code.visualstudio.com/api)
- **VSCE CLI**: [VSCE Documentation](https://github.com/microsoft/vscode-vsce)
- **GitHub Issues**: [Report Issues](https://github.com/YOUR-USERNAME/open-js-debug-terminal/issues)

## 📊 Success Metrics

After publishing, track these metrics:

- **Downloads**: Check marketplace analytics
- **Ratings**: Monitor user ratings and reviews
- **GitHub Stars**: Track repository engagement
- **Issues**: Respond to user feedback

## 🎉 Congratulations!

Once published, your extension will be available to millions of VS Code users worldwide! 

Remember to:
- Keep dependencies up to date
- Respond to user feedback
- Plan regular updates
- Consider new features based on user requests

---

**Happy Publishing! 🚀**
