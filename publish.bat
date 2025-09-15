@echo off
REM 🚀 Local Publishing Script for VS Code Extension (Windows)
REM This script automates the local publishing process on Windows

setlocal enabledelayedexpansion

echo 🚀 Starting local publishing process...

echo 📋 Checking dependencies...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ git is not installed
    pause
    exit /b 1
)

REM Check if vsce is installed
vsce --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ vsce is not installed. Installing globally...
    npm install -g @vscode/vsce
    if !errorlevel! neq 0 (
        echo ❌ Failed to install vsce
        pause
        exit /b 1
    )
)

echo ✅ All dependencies are available

REM Get current version
for /f "tokens=*" %%a in ('node -p "require('./package.json').version"') do set current_version=%%a
echo 📋 Current version: %current_version%

echo.
echo Select version bump type:
echo 1) Patch (1.0.0 → 1.0.1) - Bug fixes
echo 2) Minor (1.0.0 → 1.1.0) - New features  
echo 3) Major (1.0.0 → 2.0.0) - Breaking changes
echo 4) Skip version bump
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 📋 Bumping patch version...
    npm version patch
) else if "%choice%"=="2" (
    echo 📋 Bumping minor version...
    npm version minor
) else if "%choice%"=="3" (
    echo 📋 Bumping major version...
    npm version major
) else if "%choice%"=="4" (
    echo 📋 Skipping version bump
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo 📋 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 📋 Compiling TypeScript...
npm run compile
if %errorlevel% neq 0 (
    echo ❌ Compilation failed
    pause
    exit /b 1
)

echo 📋 Running tests...
npm test
if %errorlevel% neq 0 (
    echo ⚠️ Tests failed or not configured
)

echo 📋 Packaging extension...
npm run package
if %errorlevel% neq 0 (
    echo ❌ Packaging failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Get updated version after bump
for /f "tokens=*" %%a in ('node -p "require('./package.json').version"') do set new_version=%%a

echo 📋 Committing changes...
git add .
git commit -m "Release v%new_version%"

echo 📋 Creating git tag...
git tag "v%new_version%"

echo 📋 Pushing to GitHub...
git push origin main --tags
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    pause
    exit /b 1
)

echo ✅ Git operations completed

echo 📋 Publishing to VS Code Marketplace...
echo ⚠️ Make sure you are logged in with: vsce login MarianZeis

vsce publish
if %errorlevel% neq 0 (
    echo ❌ Failed to publish to VS Code Marketplace
    echo Please run: vsce login MarianZeis
    echo Then run: vsce publish
    pause
    exit /b 1
)

echo ✅ Published to VS Code Marketplace!

set /p publish_ovsx="Do you want to publish to Open VSX Registry? (y/N): "
if /i "%publish_ovsx%"=="y" (
    ovsx --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo ⚠️ ovsx CLI not found. Installing...
        npm install -g ovsx
    )
    
    echo 📋 Publishing to Open VSX...
    ovsx publish
    if !errorlevel! neq 0 (
        echo ⚠️ Open VSX publish failed (might need login: ovsx login [token])
    )
)

echo.
echo 📋 GitHub Release Instructions:
echo 1. Go to: https://github.com/marianfoo/vsc-ext-debugterminal/releases
echo 2. Click 'Create a new release'
echo 3. Tag: v%new_version%
echo 4. Title: Release v%new_version%
for %%f in (*.vsix) do echo 5. Upload the .vsix file: %%f
echo 6. Copy description from CHANGELOG.md
echo.
pause

echo.
echo 📋 Verification steps:
echo 1. Check VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=MarianZeis.open-js-debug-terminal-here
echo 2. Test installation: code --install-extension MarianZeis.open-js-debug-terminal-here
echo 3. Check your publisher dashboard: https://marketplace.visualstudio.com/manage
echo.

echo ✅ Publishing process completed! 🎉
echo.
echo 📊 Next steps:
echo - Monitor your extension's analytics
echo - Respond to user reviews and feedback  
echo - Plan future updates and features
echo.

pause
