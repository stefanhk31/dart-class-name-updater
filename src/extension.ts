import * as vscode from 'vscode';
import * as Case from 'case';

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

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider('dart', new DartClassNameUpdater(), {
      providedCodeActionKinds: DartClassNameUpdater.providedCodeActionKinds
    }));

  const updateAllInstancesOfClassNameCommand = vscode.commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const range = editor.document.validateRange(new vscode.Range(editor.selection.start, editor.selection.end));
      const codeActions = await vscode.commands.executeCommand(
        'vscode.executeCodeActionProvider',
        editor.document.uri,
        range
      ) as vscode.CodeAction[];
      if (codeActions.length === 1 && codeActions[0].command) {
        await vscode.commands.executeCommand(codeActions[0].command.command, ...codeActions[0].command.arguments || []);
      }
    }
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}

/**
 * Provides code actions for changing all project references to a Dart class name. 
 */
export class DartClassNameUpdater implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.CodeAction | vscode.Command)[]> {
    const updateAllInstancesOfClassName = await this.createFix(document, range, 'Update all instances of class name');
    return [updateAllInstancesOfClassName];
  }
  resolveCodeAction?(codeAction: vscode.CodeAction, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeAction> {
    throw new Error('Method not implemented.');
  }

  private async createFix(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, title: string): Promise<vscode.CodeAction> {
    let fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);

    const input = await vscode.window.showInputBox({ prompt: 'Enter new class name' });

    if (!input) {
      return fix;
    }

    // need to go through and identify which parts of the class
    // should be which case -e.g., import filename needs snake,
    // class name needs pascal
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
    const snakeRegex =  new RegExp(`(${casing.snake(currentClassName)})`, 'g');

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
