import * as vscode from 'vscode';

export const  getExcludedFolders = (): string[] => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const excludedFolders = ['**/.**', '**/build/**', '**/android**', '**/android**', '**/ios**', '**/macos**', '**/linux**', '**/windows**', '**/web**'];
  
    if (!workspaceFolders) {
      return [];
    }
  
    //go through all the folders and add the .gitignore files to the excluded folders
    //the workspace may have 1 to many folders in it and thus might have many instances of gitignore files
    workspaceFolders.forEach(async (folder) => {
      const gitignoreUri = vscode.Uri.joinPath(folder.uri, '.gitignore');
      try {
        const gitignoreContent = await vscode.workspace.fs.readFile(gitignoreUri);
        const ignoredPatterns = gitignoreContent.toString().split('\n')
          .filter(line => line.trim() !== '' && !line.startsWith('#'))
          .map(line => vscode.workspace.asRelativePath(vscode.Uri.joinPath(folder.uri, line.trim()), true));
        excludedFolders.push(...ignoredPatterns);
      } catch (error) {
        return [];
        // ignore if .gitignore doesn't exist
      }
    });
    return excludedFolders;
  };