# 🚀 Open in JavaScript Debug Terminal

A simple VS Code extension that adds a **"Open in JavaScript Debug Terminal"** option to your right-click context menu. Perfect for quickly debugging Node.js, JavaScript, and TypeScript projects!

![Extension Demo](https://img.shields.io/badge/VS%20Code-Extension-blue?style=for-the-badge&logo=visual-studio-code)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ What does this extension do?

This extension adds a convenient right-click option that opens a **JavaScript Debug Terminal** in any folder or file location you choose. The debug terminal is specially designed for JavaScript/TypeScript development and debugging.

### 🔍 What's a JavaScript Debug Terminal?

A JavaScript Debug Terminal is a special terminal in VS Code that:
- ✅ Allows you to debug Node.js applications directly  
- ✅ Sets breakpoints and step through code
- ✅ Inspect variables and call stacks
- ✅ Perfect for testing Node.js scripts and applications

[Learn more about JavaScript Debug Terminal in VS Code docs →](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal)

## 📦 Installation

1. Open VS Code
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Open in JavaScript Debug Terminal"
4. Click **Install**

## 🚀 How to Use

### Method 1: Right-click a folder
1. In the **Explorer** panel, right-click any folder
2. Select **"Open in JavaScript Debug Terminal"**
3. A debug terminal opens in that folder!

### Method 2: Right-click a file
1. Right-click any JavaScript/TypeScript file or Node.js config file
2. Select **"Open in JavaScript Debug Terminal"**  
3. A debug terminal opens in the file's folder!

**Supported files**: `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `package.json`, `package-lock.json`, `yarn.lock`, `tsconfig.json`, `.nvmrc`, `.node-version`

### Method 3: Right-click in an editor
1. Right-click anywhere inside a supported file
2. Select **"Open in JavaScript Debug Terminal"**  
3. A debug terminal opens in the file's folder!

### Method 4: Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Open in JavaScript Debug Terminal"
3. Press Enter

## 🛠️ Features

- **🎯 Smart Context Menu**: Right-click folders or files to open debug terminals
- **📁 Works Everywhere**: Explorer, editor, or command palette
- **📦 Node.js Focused**: Special support for `package.json`, `yarn.lock`, `tsconfig.json`, and more
- **🔄 Intelligent Fallbacks**: Always works, even if debug features are unavailable
- **🌐 Multi-workspace Support**: Works with multiple workspace folders
- **⚡ Zero Configuration**: No setup required - just install and use!

## 🔧 System Requirements

- **VS Code**: Version 1.74 or higher
- **Operating System**: Windows, macOS, or Linux
- **JavaScript Debugger**: Built into VS Code (no additional installation needed)

## 👩‍💻 For Developers

### System Requirements

- **Node.js**: Version 20+ (required for building and publishing)
- **npm**: Usually comes with Node.js
- **Git**: For version control

## 🏃‍♂️ Quick Start Example

1. Install the extension
2. Open any JavaScript or Node.js project in VS Code
3. Right-click a folder in Explorer
4. Choose **"Open in JavaScript Debug Terminal"**
5. Try running: `node --version` or any Node.js script!

## ⚙️ How It Works (Technical Details)

This extension uses a smart 3-tier fallback system:

1. **🥇 First Choice**: Uses VS Code's built-in debug terminal command
2. **🥈 Second Choice**: Creates a terminal using the JavaScript Debug Terminal profile
3. **🥉 Final Fallback**: Creates a regular terminal (still useful!)

This ensures the extension always works, regardless of your VS Code configuration.

## ❓ Troubleshooting

### The extension doesn't appear in my context menu
- Make sure you're right-clicking on a folder or JavaScript/TypeScript file
- Try restarting VS Code after installation

### I get a regular terminal instead of a debug terminal
- This is normal! The extension falls back to a regular terminal if debug features aren't available
- You'll see a notification explaining this
- The terminal still opens in the correct folder and is fully functional

### The command doesn't work from the Command Palette
- Make sure you have a folder open in VS Code
- Try opening a file or folder first, then run the command

## 🤝 Support

- **Issues**: [Report bugs or request features](https://github.com/marianfoo/vsc-ext-debugterminal/issues)
- **Discussions**: [Ask questions or share feedback](https://github.com/marianfoo/vsc-ext-debugterminal/discussions)

## 📝 Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for detailed release history.

---

## 👩‍💻 For Developers

### Building the Extension

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch

# Package the extension
npm run package
```

### Testing the Extension

1. Press `F5` in VS Code to launch Extension Development Host
2. Test the extension in the new VS Code window
3. Check the Debug Console for extension logs

### Local Publishing

For maintainers who want to publish updates locally (without GitHub Actions):

**Quick Start:**
```bash
# On macOS/Linux:
./publish.sh

# On Windows:
publish.bat
```

**Manual Process:**
See [LOCAL_PUBLISHING_GUIDE.md](./LOCAL_PUBLISHING_GUIDE.md) for detailed step-by-step instructions.

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This extension is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as needed.

