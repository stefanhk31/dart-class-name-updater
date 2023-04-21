import * as vscode from 'vscode';
import * as Case from 'case';
import { commands, ExtensionContext, window, languages } from 'vscode';
import { execFile } from 'child_process';


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

/**
 * Provides code actions for changing all project references to a Dart class name. 
 */
export class DartClassNameUpdater implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor
  ];

  async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.CodeAction | vscode.Command)[]> {
    const updateAllInstancesOfClassName = await this.createFix(document, range, 'Update all instances of class name');
    return [
      {
        "command": "dart-class-name-updater.updateAllInstancesOfClass",
        "title": "Change class name"
      }
    ].map((c) => {
      let action = new vscode.CodeAction(c.title, vscode.CodeActionKind.Refactor);
      action.command = {
        command: c.command,
        title: c.title,
      };
      return action;
    });;
  }
  resolveCodeAction?(codeAction: vscode.CodeAction, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeAction> {
    return codeAction;
  }

  private async createFix(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, title: string): Promise<vscode.CodeAction> {
    let fix = new vscode.CodeAction(title, vscode.CodeActionKind.Refactor);

    const input = await vscode.window.showInputBox({ prompt: 'Enter new class name' });

    if (!input) {
      return fix;
    }

    const casing: CaseObject = require('case');
    const newNamePascal = this.inputToPascalCase(input);
    const newNameSnake = casing.snake(newNamePascal);

    const currentText = document.getText();
    const classNameRegExp = /class\s+(\w+)/;
    const match = classNameRegExp.exec(currentText);
    if (!match) {
      return fix;
    }

    const currentClassName = match[1];
    const pascalRegex = new RegExp(`(${casing.pascal(currentClassName)})`, 'g');
    const snakeRegex = new RegExp(`(${casing.snake(currentClassName)})`, 'g');

    const currentUri = document.uri;
    const currentPath = currentUri.path;
    const currentFolderUri = vscode.Uri.file(currentPath.substring(0, currentPath.lastIndexOf('/')));
    const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${newNameSnake}.dart`);
    const newUri = currentFolderUri.with({ path: newFilename });

    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.renameFile(currentUri, newUri);

    const newText = document.getText().replace(
      pascalRegex, (match) => casing.pascal(newNamePascal)
    ).replace(
      snakeRegex, (match) => casing.snake(newNameSnake)
    );

    fix.edit.replace(document.uri, range, newText);
    return fix;
  }

  private inputToPascalCase(input: string): string {
    return input.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}

export const updateAllInstancesOfClassName = async () => {
  const input = await vscode.window.showInputBox({ prompt: 'Enter new class name' });
  if (!input) {
    return;
  }


  const casing: CaseObject = require('case');
  const newNamePascal = inputToPascalCase(input);
  const newNameSnake = casing.snake(newNamePascal);


  //TODO: if there is no file open in the editor then we can't update anything, this means if we try to change things from the file explorer context menu(where we currently change things) then nothing will happen.
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const currentText = editor.document.getText();

  //TODO: this currently returns every single file in the project....
  const classNameRegExp = /(class|enum|mixin|typedef|extension)\s+(\w+)/;

  const match = classNameRegExp.exec(currentText);
  if (!match) {
    return;
  }

  const currentClassName = match[1];
  const pascalRegex = new RegExp(`(${casing.pascal(currentClassName)})`, 'g');
  const snakeRegex = new RegExp(`(${casing.snake(currentClassName)})`, 'g');

  //TODO: this assumes the file is on disc, what if it hasn't been saved yet, can we check currently unsaved files?
  const currentUri = editor.document.uri;
  const newUri = await renameFile(currentUri, newNameSnake);

  await updateInstances(newUri, pascalRegex, casing, newNamePascal, snakeRegex, newNameSnake);

  const excludedFolders = getExcludedFolders().join(',');
  const allDartFiles = await vscode.workspace.findFiles('**/*.dart', excludedFolders);
  for (const uri of allDartFiles) {
    await updateInstances(uri, pascalRegex, casing, newNamePascal, snakeRegex, newNameSnake);
  }
  await vscode.workspace.saveAll();
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
  const updateAllInstancesOfClassNameCommand = commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', () => {
    let editor = window.activeTextEditor;
    if (editor && editor.document.languageId === 'dart') {
      updateAllInstancesOfClassName();
    }
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}