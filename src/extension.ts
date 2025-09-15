import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Opens a JavaScript Debug Terminal in the specified directory.
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
 */
async function openJsDebugTerminalWithCwd(cwdUri?: vscode.Uri) {
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
export function activate(context: vscode.ExtensionContext) {
  console.log('[Debug Terminal Extension] Activating extension...');
  
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
