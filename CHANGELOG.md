# Changelog

All notable changes to the "Open in JavaScript Debug Terminal" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-15

### Added
- **Enhanced File Support**: Now explicitly supports Node.js configuration files:
  - `package.json` - Right-click to open debug terminal in project root
  - `package-lock.json` - NPM lock file support
  - `yarn.lock` - Yarn lock file support  
  - `tsconfig.json` - TypeScript configuration support
  - `.nvmrc` - Node version manager files
  - `.node-version` - Node version files
- **Improved Keywords**: Better discoverability with `package.json`, `npm`, `yarn` keywords

### Technical Details
- Enhanced VS Code menu conditions with explicit filename matching
- Better support for Node.js development workflows
- Maintained backward compatibility with all existing functionality

## [1.0.0] - 2025-01-15

### Added
- 🎯 **Explorer Context Menu**: Right-click any folder or JavaScript/TypeScript file in Explorer to open a debug terminal
- 📝 **Editor Context Menu**: Right-click inside any JavaScript/TypeScript file editor to open debug terminal in file's directory
- 🎨 **Command Palette**: Access the command via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- 🔄 **Smart Fallback System**: Three-tier approach ensures terminal always opens:
  1. VS Code's built-in JavaScript Debug Terminal command (preferred)
  2. JavaScript Debug Terminal profile (good alternative)
  3. Regular terminal (reliable fallback)
- 🌐 **Multi-workspace Support**: Works correctly with multi-root workspaces
- 🛠️ **URI Scheme Support**: Compatible with local files, remote development, and other VS Code URI schemes
- 📊 **Comprehensive Logging**: Detailed console logging for debugging and troubleshooting
- ✅ **User-friendly Error Messages**: Clear feedback when operations fail
- 🔍 **Smart File Detection**: Supports JavaScript, TypeScript, JSX, TSX, and JSON files

### Technical Details
- **VS Code Version**: Requires VS Code 1.74+
- **File Support**: `.js`, `.cjs`, `.mjs`, `.ts`, `.jsx`, `.tsx`, `.json`
- **Menu Integration**: Explorer context, editor context, and command palette
- **Error Handling**: Graceful fallbacks with user notifications
- **Cross-platform**: Windows, macOS, and Linux support

### Documentation
- 📚 **Comprehensive README**: User-friendly documentation with examples and troubleshooting
- 🔧 **Developer Comments**: Extensively commented code for easy understanding
- 🏗️ **Build System**: Complete TypeScript build and packaging setup
- 🚀 **CI/CD Ready**: GitHub Actions workflows for testing and publishing
