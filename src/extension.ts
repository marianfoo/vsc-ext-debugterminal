import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * CodeLens provider for npm scripts in package.json.
 * This provides "Run in Terminal" links above each npm script,
 * offering an alternative to the native "Run Script" that uses task terminals.
 */
class NpmScriptCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  /**
   * Provides CodeLens items for npm scripts in package.json
   */
  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    // Only process package.json files
    if (path.basename(document.fileName) !== 'package.json') {
      return [];
    }

    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();

    try {
      const packageJson = JSON.parse(text);
      
      if (!packageJson.scripts || typeof packageJson.scripts !== 'object') {
        return [];
      }

      // Parse the document to find script line positions
      const lines = text.split('\n');
      let inScriptsSection = false;
      let scriptsSectionStartLine = -1;

      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        
        // Detect when we enter the scripts section
        if (line.match(/^\s*"scripts"\s*:\s*\{/)) {
          inScriptsSection = true;
          scriptsSectionStartLine = lineNum;
          continue;
        }

        // Detect when we exit the scripts section
        if (inScriptsSection && line.match(/^\s*\}/)) {
          inScriptsSection = false;
          continue;
        }

        // If we're in the scripts section, look for script definitions
        if (inScriptsSection) {
          const scriptMatch = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)"/);
          
          if (scriptMatch) {
            const scriptName = scriptMatch[1];
            const scriptCommand = scriptMatch[2];
            
            // Create a range for the script line
            const range = new vscode.Range(lineNum, 0, lineNum, line.length);
            
            // Create "Run in Terminal" CodeLens
            const runCodeLens = new vscode.CodeLens(range, {
              title: '▶ Run in Terminal',
              tooltip: `Run "${scriptName}" in a new terminal`,
              command: 'openJsDebugTerminalHere.runNpmScriptByName',
              arguments: [document.uri, scriptName, scriptCommand, false]
            });
            
            codeLenses.push(runCodeLens);
            
            // Create "Debug Script" CodeLens
            const debugCodeLens = new vscode.CodeLens(range, {
              title: '$(debug-alt) Debug Script',
              tooltip: `Debug "${scriptName}" in a JavaScript Debug Terminal`,
              command: 'openJsDebugTerminalHere.runNpmScriptByName',
              arguments: [document.uri, scriptName, scriptCommand, true]
            });
            
            codeLenses.push(debugCodeLens);
          }
        }
      }
    } catch (error) {
      console.log('[CodeLens] Failed to parse package.json:', error);
      return [];
    }

    return codeLenses;
  }

  public refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }
}

/**
 * Opens a JavaScript Debug Terminal in the specified directory and optionally runs a command.
 * This function implements a fallback strategy to ensure the terminal opens even if
 * some VS Code features are not available.
 * 
 * Fallback Strategy:
 * 1. Activate the JavaScript Debugger extension if needed
 * 2. Try the built-in JS Debug command (most reliable)
 * 3. Try the JavaScript Debug Terminal profile (good alternative)
 * 4. Fall back to a regular terminal (always works)
 * 
 * @param cwdUri - The URI of the directory where the terminal should open.
 *                 If undefined, uses VS Code's default terminal directory.
 * @param command - Optional command to run in the terminal after opening.
 */
async function openJsDebugTerminalWithCwd(cwdUri?: vscode.Uri, command?: string) {
  // The official command provided by VS Code's built-in JavaScript Debugger
  const officialJsDebugCommand = 'extension.js-debug.createDebuggerTerminal';
  
  // Pre-step: Ensure JavaScript Debugger extension is activated
  // This is crucial because the extension is lazy-loaded and may not be available initially
  try {
    console.log('[Debug Terminal] Ensuring JavaScript Debugger extension is activated...');
    
    // Method 1: Try to get and activate the JS Debug extension directly
    const jsDebugExtension = vscode.extensions.getExtension('ms-vscode.js-debug');
    
    if (jsDebugExtension && !jsDebugExtension.isActive) {
      console.log('[Debug Terminal] Activating JavaScript Debugger extension directly...');
      await jsDebugExtension.activate();
      
      // Give it a moment to fully initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Method 2: Alternative activation by trying to access terminal profiles
    // This can trigger the debugger extension to load if it hasn't already
    try {
      await vscode.commands.executeCommand('workbench.action.terminal.showProfiles');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      // Ignore - this is just an attempt to trigger activation
    }
    
  } catch (error) {
    console.log('[Debug Terminal] Could not activate JS Debug extension:', error);
    // Continue anyway - might still work
  }
  
  // Strategy 1: Try to use the official JS Debug command
  // This is the most reliable method when available
  try {
    console.log('[Debug Terminal] Attempting to use official JS Debug command...');
    
    // Get all available commands to check if the JS Debug command exists
    const availableCommands = await vscode.commands.getCommands(true);
    
    if (availableCommands.includes(officialJsDebugCommand)) {
      console.log('[Debug Terminal] Official JS Debug command found, using it...');
      
      // Execute the command with the current working directory
      await vscode.commands.executeCommand(officialJsDebugCommand, { 
        cwd: cwdUri?.fsPath ?? undefined 
      });
      
      console.log('[Debug Terminal] Successfully opened using official command');
      return; // Success! Exit early
    } else {
      console.log('[Debug Terminal] Official JS Debug command not available');
    }
  } catch (error) {
    console.log('[Debug Terminal] Failed to use official command:', error);
    // Continue to next strategy
  }

  // Strategy 2: Try to create a terminal using the JavaScript Debug Terminal profile
  // This profile is usually available if the JavaScript Debugger extension is active
  try {
    console.log('[Debug Terminal] Attempting to use JavaScript Debug Terminal profile...');
    
    await vscode.commands.executeCommand('workbench.action.terminal.newWithProfile', {
      profileName: 'JavaScript Debug Terminal',
      cwd: cwdUri?.fsPath ?? undefined
    });
    
    console.log('[Debug Terminal] Successfully opened using terminal profile');
    return; // Success! Exit early
  } catch (error) {
    console.log('[Debug Terminal] Failed to use terminal profile:', error);
    // Continue to final fallback
  }

  // Strategy 3: Final fallback - create a regular integrated terminal
  // This always works but doesn't have debug capabilities
  console.log('[Debug Terminal] Using fallback: creating regular terminal...');
  
  const terminal = vscode.window.createTerminal({
    name: 'JavaScript Debug Terminal (Fallback)',
    cwd: cwdUri // VS Code handles URI to path conversion automatically
  });
  
  // Show the terminal to the user
  terminal.show();
  
  console.log('[Debug Terminal] Successfully created fallback terminal');
  
  // If a command was provided, send it to the terminal
  if (command) {
    terminal.sendText(command);
  }
  
  // Inform user about the fallback
  vscode.window.showInformationMessage(
    'Opened regular terminal (JavaScript Debug features not available)'
  );
}

/**
 * Helper function to get the parent directory URI from any given URI.
 * Works with different URI schemes (file://, untitled://, etc.)
 * 
 * This is needed because VS Code can work with various URI schemes:
 * - file:// for local files
 * - untitled:// for unsaved files  
 * - remote schemes when using Remote Development extensions
 * 
 * @param uri - The URI to get the parent directory for
 * @returns A new URI pointing to the parent directory
 */
function getParentDirectoryUri(uri: vscode.Uri): vscode.Uri {
  // For file:// scheme, use Node.js path utilities for reliability
  if (uri.scheme === 'file') {
    const parentPath = path.dirname(uri.fsPath);
    return vscode.Uri.file(parentPath);
  }
  
  // For other schemes (remote, untitled, etc.), use generic string manipulation
  // Remove any trailing slashes to normalize the path
  const normalizedPath = uri.path.replace(/\/+$/, '');
  
  // Remove the last path segment to get parent directory
  // If no segments remain, default to root '/'
  const parentPath = normalizedPath.replace(/\/[^\/]+$/, '') || '/';
  
  // Return a new URI with the same scheme but updated path
  return uri.with({ path: parentPath });
}

/**
 * This function is called when the extension is activated.
 * It registers the command that users can invoke from context menus or command palette.
 * 
 * VS Code Extension Lifecycle:
 * 1. activate() is called when the extension needs to be activated
 * 2. Commands are registered and become available to users
 * 3. deactivate() is called when VS Code shuts down or extension is disabled
 * 
 * @param context - Contains methods and properties for the extension lifecycle
 */
/**
 * Monitors the extension setting for disabling native npm script hover
 * and applies it to VS Code's npm.scriptHover setting.
 */
function setupNpmScriptHoverControl(context: vscode.ExtensionContext) {
  // Apply setting on activation
  const applyNpmScriptHoverSetting = async () => {
    const config = vscode.workspace.getConfiguration('openJsDebugTerminalHere');
    const disableNativeHover = config.get<boolean>('disableNativeNpmScriptHover', false);
    
    if (disableNativeHover) {
      const npmConfig = vscode.workspace.getConfiguration('npm');
      const currentScriptHover = npmConfig.get<boolean>('scriptHover');
      
      if (currentScriptHover !== false) {
        // Update the setting to disable native hover
        await npmConfig.update('scriptHover', false, vscode.ConfigurationTarget.Global);
        console.log('[Debug Terminal Extension] Disabled native npm script hover');
      }
    }
  };
  
  // Apply on activation
  applyNpmScriptHoverSetting();
  
  // Watch for changes to the setting
  const configWatcher = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('openJsDebugTerminalHere.disableNativeNpmScriptHover')) {
      applyNpmScriptHoverSetting();
      vscode.window.showInformationMessage(
        'npm script hover setting updated. Reload VS Code for changes to take effect.',
        'Reload'
      ).then(selection => {
        if (selection === 'Reload') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
    }
  });
  
  context.subscriptions.push(configWatcher);
}

export function activate(context: vscode.ExtensionContext) {
  console.log('[Debug Terminal Extension] Activating extension...');
  
  // Setup npm script hover control
  setupNpmScriptHoverControl(context);
  
  // Register our main command that users will invoke
  const commandDisposable = vscode.commands.registerCommand(
    'openJsDebugTerminalHere.open', 
    async (contextResource?: vscode.Uri) => {
      console.log('[Debug Terminal Extension] Command executed');
      
      let targetDirectory: vscode.Uri | undefined;

      try {
        // Determine the target directory based on how the command was invoked
        targetDirectory = await determineTargetDirectory(contextResource);
        
        console.log('[Debug Terminal Extension] Target directory:', targetDirectory?.toString());
        
        // Open the debug terminal in the determined directory
        await openJsDebugTerminalWithCwd(targetDirectory);
        
      } catch (error) {
        // Show user-friendly error message if something goes wrong
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[Debug Terminal Extension] Error:', error);
        
        vscode.window.showErrorMessage(
          `Failed to open JavaScript Debug Terminal: ${errorMessage}`
        );
      }
    }
  );

  // Register the command with VS Code so it gets cleaned up when extension is deactivated
  context.subscriptions.push(commandDisposable);
  
  // Register the npm script runner command
  const runNpmScriptDisposable = vscode.commands.registerCommand(
    'openJsDebugTerminalHere.runNpmScript',
    async () => {
      console.log('[Debug Terminal Extension] Run npm script command executed');
      
      try {
        await runNpmScriptInDebugTerminal();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[Debug Terminal Extension] Error running npm script:', error);
        
        vscode.window.showErrorMessage(
          `Failed to run npm script: ${errorMessage}`
        );
      }
    }
  );
  
  context.subscriptions.push(runNpmScriptDisposable);
  
  // Register the npm script runner by name command (for CodeLens)
  const runNpmScriptByNameDisposable = vscode.commands.registerCommand(
    'openJsDebugTerminalHere.runNpmScriptByName',
    async (documentUri: vscode.Uri, scriptName: string, scriptCommand: string, useDebugTerminal: boolean = false) => {
      console.log('[Debug Terminal Extension] Run npm script by name:', scriptName, 'debug:', useDebugTerminal);
      
      try {
        // Get the directory containing package.json
        const packageDir = getParentDirectoryUri(documentUri);
        
        if (useDebugTerminal) {
          // Open a JavaScript Debug Terminal and run the script
          await openJsDebugTerminalWithCwd(packageDir);
          
          // Give the terminal a moment to initialize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Send the npm run command to the terminal
          const terminal = vscode.window.activeTerminal;
          if (terminal) {
            terminal.sendText(`npm run ${scriptName}`);
            console.log('[Debug Terminal Extension] Running script in debug terminal');
          }
        } else {
          // Create a regular terminal (not debug, not task) in the package directory
          const terminal = vscode.window.createTerminal({
            name: `npm: ${scriptName}`,
            cwd: packageDir.fsPath
          });
          
          // Show and run the script
          terminal.show();
          terminal.sendText(`npm run ${scriptName}`);
          
          console.log('[Debug Terminal Extension] Running script in new terminal');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[Debug Terminal Extension] Error running npm script by name:', error);
        
        vscode.window.showErrorMessage(
          `Failed to run npm script: ${errorMessage}`
        );
      }
    }
  );
  
  context.subscriptions.push(runNpmScriptByNameDisposable);
  
  // Register CodeLens provider for package.json files
  const codeLensProvider = new NpmScriptCodeLensProvider();
  const codeLensDisposable = vscode.languages.registerCodeLensProvider(
    { pattern: '**/package.json' },
    codeLensProvider
  );
  
  context.subscriptions.push(codeLensDisposable);
  
  console.log('[Debug Terminal Extension] Extension activated successfully');
}

/**
 * Determines the appropriate directory to open the debug terminal in.
 * 
 * Priority order:
 * 1. If invoked from context menu, use the selected resource
 * 2. If invoked from editor, use the current file's directory  
 * 3. If invoked from command palette, use the first workspace folder
 * 
 * @param contextResource - The resource passed from VS Code context (may be undefined)
 * @returns Promise resolving to the target directory URI
 */
async function determineTargetDirectory(contextResource?: vscode.Uri): Promise<vscode.Uri | undefined> {
  // Case 1: Command was invoked from a context menu (right-click)
  if (contextResource instanceof vscode.Uri) {
    console.log('[Debug Terminal Extension] Using context resource:', contextResource.toString());
    
    // Check if the resource is a directory or file
    const resourceStats = await vscode.workspace.fs.stat(contextResource);
    
    if (resourceStats.type & vscode.FileType.Directory) {
      // It's a directory, use it directly
      return contextResource;
    } else {
      // It's a file, use its parent directory
      return getParentDirectoryUri(contextResource);
    }
  }
  
  // Case 2: Command was invoked from editor context or command palette
  // Try to use the currently active editor's file directory
  if (vscode.window.activeTextEditor) {
    const activeDocumentUri = vscode.window.activeTextEditor.document.uri;
    console.log('[Debug Terminal Extension] Using active editor directory:', activeDocumentUri.toString());
    
    return getParentDirectoryUri(activeDocumentUri);
  }
  
  // Case 3: Fallback to first workspace folder if available
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const firstWorkspaceFolder = vscode.workspace.workspaceFolders[0].uri;
    console.log('[Debug Terminal Extension] Using first workspace folder:', firstWorkspaceFolder.toString());
    
    return firstWorkspaceFolder;
  }
  
  // No suitable directory found
  console.log('[Debug Terminal Extension] No suitable directory found');
  throw new Error('No workspace folder or active file found. Please open a folder or file first.');
}

/**
 * Extracts and runs an npm script from the current line in package.json.
 * This function detects if the user is on a script line, extracts the script name,
 * and runs it in a JavaScript Debug Terminal.
 */
async function runNpmScriptInDebugTerminal() {
  const editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    throw new Error('No active editor found');
  }
  
  const document = editor.document;
  
  // Check if we're in a package.json file
  if (path.basename(document.fileName) !== 'package.json') {
    throw new Error('This command only works in package.json files');
  }
  
  // Get the current line
  const currentLine = editor.selection.active.line;
  const lineText = document.lineAt(currentLine).text;
  
  console.log('[Debug Terminal Extension] Current line:', lineText);
  
  // Try to extract script name from the current line
  // Pattern: "scriptName": "command"
  const scriptMatch = lineText.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)"/);
  
  if (!scriptMatch) {
    throw new Error('Current line does not appear to be an npm script. Place your cursor on a script line.');
  }
  
  const scriptName = scriptMatch[1];
  const scriptCommand = scriptMatch[2];
  
  console.log('[Debug Terminal Extension] Found script:', scriptName, '→', scriptCommand);
  
  // Verify we're in the "scripts" section by checking the JSON structure
  const text = document.getText();
  const cursorOffset = document.offsetAt(editor.selection.active);
  
  // Find the nearest enclosing object key before the cursor
  const textBeforeCursor = text.substring(0, cursorOffset);
  const lastSectionMatch = textBeforeCursor.match(/"(\w+)"\s*:\s*\{[^}]*$/);
  
  if (!lastSectionMatch || lastSectionMatch[1] !== 'scripts') {
    throw new Error('Current line is not in the "scripts" section of package.json');
  }
  
  // Get the directory containing package.json
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const packageDir = getParentDirectoryUri(document.uri);
  
  console.log('[Debug Terminal Extension] Running script in directory:', packageDir.fsPath);
  
  // Open debug terminal and run the npm script
  await openJsDebugTerminalWithCwd(packageDir);
  
  // Give the terminal a moment to initialize
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Send the npm run command to the terminal
  const terminal = vscode.window.activeTerminal;
  if (terminal) {
    terminal.sendText(`npm run ${scriptName}`);
    vscode.window.showInformationMessage(`Running: npm run ${scriptName}`);
  }
}

/**
 * This function is called when the extension is deactivated.
 * 
 * Since we properly register our disposables with the context.subscriptions,
 * VS Code will automatically clean up our command registrations, so we don't
 * need to do any manual cleanup here.
 * 
 * This function is provided for completeness and future extensibility.
 */
export function deactivate() {
  console.log('[Debug Terminal Extension] Extension deactivated');
}
