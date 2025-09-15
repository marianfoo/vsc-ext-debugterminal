# 🚀 Quick Start - Local Publishing

## One-Command Publishing

### macOS/Linux:
```bash
./publish.sh
```

### Windows:
```batch
publish.bat
```

The scripts will automatically:
- ✅ Check dependencies
- ✅ Ask for version bump (patch/minor/major)
- ✅ Build and test your extension
- ✅ Commit changes and create git tag
- ✅ Push to GitHub
- ✅ Publish to VS Code Marketplace
- ✅ Optionally publish to Open VSX
- ✅ Guide you through creating GitHub releases

## Manual Step-by-Step

If you prefer manual control, see [LOCAL_PUBLISHING_GUIDE.md](./LOCAL_PUBLISHING_GUIDE.md)

## First-Time Setup Required

Before using the scripts, you need to:

1. **Create VS Code Publisher Account**
   - Go to [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
   - Publisher ID: `MarianZeis` (already configured)

2. **Get Personal Access Token**
   - Go to [dev.azure.com](https://dev.azure.com)
   - Create token with "Marketplace (Manage)" permissions

3. **Login to VSCE**
   ```bash
   vsce login MarianZeis
   # Enter your PAT when prompted
   ```

4. **Create GitHub Repository** (if not done)
   - Repository: `vsc-ext-debugterminal` (already configured)

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Compile TypeScript  
npm run compile

# Package extension
npm run package

# Publish to marketplace
vsce publish

# Install VSCE globally (if needed)
npm install -g @vscode/vsce

# Login to marketplace
vsce login MarianZeis
```

## Files Ready for Publishing

- ✅ Extension code with comprehensive documentation
- ✅ User-friendly README with installation instructions
- ✅ Professional package.json with correct metadata
- ✅ Detailed changelog
- ✅ MIT license
- ✅ Automated build scripts
- ✅ GitHub workflows (optional automation)

## Your Extension Details

- **Name**: Open in JavaScript Debug Terminal
- **Publisher**: MarianZeis  
- **Repository**: https://github.com/marianfoo/vsc-ext-debugterminal
- **Marketplace**: MarianZeis.open-js-debug-terminal-here

---

**Ready to publish? Just run `./publish.sh` and follow the prompts! 🎉**
