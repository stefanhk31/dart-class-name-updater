import * as vscode from 'vscode';
import * as Case from 'case';
import { commands, ExtensionContext, window } from 'vscode';


interface CaseObject {
  camel: typeof Case.camel;
  capital: typeof Case.capital;
  constant: typeof Case.constant;
  header: typeof Case.header;
  kebab: typeof Case.kebab;
  lower: typeof Case.lower;
  pascal: typeof Case.pascal;
  sentence: typeof Case.sentence;
  snake: typeof Case.snake;
  title: typeof Case.title;
  upper: typeof Case.upper;
  of: typeof Case.of;
}

export const updateAllInstancesOfClassName = async (uri: vscode.Uri) => {
  const input = await vscode.window.showInputBox({ prompt: 'Enter new class name' });
  if (!input) {
    return;
  }


  const casing: CaseObject = require('case');
  const newNamePascal = inputToPascalCase(input);
  const newNameSnake = casing.snake(newNamePascal);

  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document);
  const currentText = editor.document.getText();
  const classNameRegExp = /class\s+(\w+)/;
  const match = classNameRegExp.exec(currentText);
  if (!match) {
    return;
  }

  const currentClassName = match[1];
  const pascalRegex = new RegExp(`(${casing.pascal(currentClassName)})`, 'g');
  const snakeRegex = new RegExp(`(${casing.snake(currentClassName)})`, 'g');

  const currentUri = editor.document.uri;
  const newUri = await renameFile(currentUri, newNameSnake);

  await updateInstances(newUri, pascalRegex, casing, newNamePascal, snakeRegex, newNameSnake);

  const excludedFolders = getExcludedFolders().join(',');
  const allDartFiles = await vscode.workspace.findFiles('**/*.dart', excludedFolders);
  for (const uri of allDartFiles) {
    await updateInstances(uri, pascalRegex, casing, newNamePascal, snakeRegex, newNameSnake);
  }
};

export const inputToPascalCase = (input: string) => {
  return input.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

function getExcludedFolders(): string[] {
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
}
//TODO: Refactor this to use  await vscode.workspace.fs.writeFile(uri, Buffer.from(newContents)); rather than opening up a new editor window to make edits
async function updateInstances(newUri: vscode.Uri, pascalRegex: RegExp, casing: CaseObject, newNamePascal: string, snakeRegex: RegExp, newNameSnake: string) {
  const newDocument = await vscode.workspace.openTextDocument(newUri);
  const newEditor = await vscode.window.showTextDocument(newDocument);
  const newRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(newDocument.lineCount, 0));

  const newText = newDocument.getText().replace(
    pascalRegex, (_) => casing.pascal(newNamePascal)
  ).replace(
    snakeRegex, (_) => casing.snake(newNameSnake)
  );
  newEditor.edit((editBuilder) => editBuilder.replace(newRange, newText));
  
  // Save the updated file
  await newDocument.save();

  // Close the editor if the current file is not the same as the file we are renaming
  if (!uriMatchesFileName(newUri, newNameSnake)) {
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  }
}

function uriMatchesFileName(uri: vscode.Uri, fileName: string) {
  return uri.toString().includes(fileName);
}

async function renameFile(currentUri: vscode.Uri, newNameSnake: string) {
  const currentPath = currentUri.path;
  const currentFolderUri = vscode.Uri.file(currentPath.substring(0, currentPath.lastIndexOf('/')));
  const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${newNameSnake}.dart`);
  const newUri = currentFolderUri.with({ path: newFilename });

  await vscode.workspace.fs.rename(currentUri, newUri);
  return newUri;
}

export function activate(context: ExtensionContext) {
  const updateAllInstancesOfClassNameCommand = commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', (uri: vscode.Uri) => {
      updateAllInstancesOfClassName(uri);    
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}