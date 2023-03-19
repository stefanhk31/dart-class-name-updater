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
  let disposable = vscode.commands.registerCommand('dart-class-name-updater.changeClassName', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const newName = await vscode.window.showInputBox({ prompt: 'Enter new class name' });
    if (!newName) {
      return;
    }

    const currentDocument = editor.document;
    const currentText = currentDocument.getText();

    const classNameRegExp = /class\s+(\w+)/;
    const match = classNameRegExp.exec(currentText);
    if (!match) {
      return;
    }

    const currentClassName = match[1];
	const casing: CaseObject = require('case');

    const newClassName = casing[casing.of(currentClassName) as keyof CaseObject](newName);

    const currentUri = currentDocument.uri;
    const currentPath = currentUri.path;
    const currentFolderUri = vscode.Uri.file(currentPath.substring(0, currentPath.lastIndexOf('/')));
    const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${newClassName}.dart`);
    const newUri = currentFolderUri.with({ path: newFilename });

    await vscode.workspace.fs.rename(currentUri, newUri);

    const newDocument = await vscode.workspace.openTextDocument(newUri);
    const newEditor = await vscode.window.showTextDocument(newDocument);
    const newRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(newDocument.lineCount, 0));
	const newText = newDocument.getText(newRange).replace(
		new RegExp(`(${currentClassName}|${casing.camel(currentClassName)}|${casing.pascal(currentClassName)}|${casing.snake(currentClassName)}|${casing.constant(currentClassName)})`, 'g'),
		(match) => casing[casing.of(match) as keyof CaseObject](newName)
	  );    newEditor.edit((editBuilder) => editBuilder.replace(newRange, newText));
  });

  context.subscriptions.push(disposable);
}
