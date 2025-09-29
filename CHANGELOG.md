# Changelog

All notable changes to the "Open in JavaScript Debug Terminal" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-09-29

### Added
- **🚀 Dual CodeLens Integration**: Adds TWO links above each npm script in `package.json`
  - **"▶ Run in Terminal"** - Runs in a new, dedicated regular terminal
  - **"🐛 Debug Script"** - Runs in a JavaScript Debug Terminal with full debugging capabilities
  - No more reused task terminals - each script gets its own terminal!
  - Alternative to VS Code's native "Run Script" that uses the task system
- **⚙️ Disable Native Hover Setting**: New option to hide VS Code's built-in "Run Script" / "Debug Script" hover
  - Setting: `openJsDebugTerminalHere.disableNativeNpmScriptHover`
  - Automatically sets `npm.scriptHover` to `false` when enabled
  - Use only the extension's CodeLens links instead of native hover
- **⌨️ Keyboard Shortcut**: Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux) on any script line
- **🎯 Smart Script Detection**: Automatically detects npm script lines in package.json
- **🔍 Script Section Validation**: Only shows CodeLens in the "scripts" section

### Improved
- Solves the problem of VS Code's native "Run Script" reusing terminals
- Each npm script now runs in its own dedicated terminal (proper terminal, not task terminal)
- Clean terminal experience without task system interference
- Choice between regular terminal and debug terminal for each script
- CodeLens links are always visible (no hovering required!)

### Technical Details
- New `NpmScriptCodeLensProvider` class provides inline dual-action CodeLens
- Enhanced command: `openJsDebugTerminalHere.runNpmScriptByName` supports both regular and debug modes
- New command: `openJsDebugTerminalHere.runNpmScript` for keyboard shortcut
- New configuration: `openJsDebugTerminalHere.disableNativeNpmScriptHover`
- Automatic `npm.scriptHover` management based on user preference
- CodeLens activation on `onLanguage:json` for package.json files
- Creates regular terminals with `vscode.window.createTerminal()` (not task)
- Debug mode uses `openJsDebugTerminalWithCwd()` for full debugging support
- Compatible with all existing extension features

## [1.1.1] - 2025-01-15

### Fixed
- **JavaScript Debugger Activation**: Fixed issue where extension would fallback to regular terminal on first use
- **Lazy Loading Issue**: Extension now properly activates the JavaScript Debugger extension if it hasn't been loaded yet
- **Multi-workspace Support**: Improved reliability when working with VS Code workspaces containing multiple projects
- **First-Run Experience**: No longer requires manually opening a debug terminal before the extension works

### Technical Details
- Added extension activation check for `ms-vscode.js-debug`
- Implemented dual activation strategy (direct activation + profile trigger)
- Added initialization delays to ensure proper debugger loading
- Enhanced logging for better debugging of activation issues

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
