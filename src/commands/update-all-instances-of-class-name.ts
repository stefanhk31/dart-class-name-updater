import * as vscode from 'vscode';
import { inputToPascalCase } from '../utils/input-to-pascal-case';
import { getExcludedFolders } from '../utils/get-excluded-folders';
import { NameUpdater } from '../services/name-updater';

export const updateAllInstancesOfClassName = async (uri: vscode.Uri) => {
    const input = await showInputBox('Enter new class name');
    if (!input) {
      return;
    }
  
    const newNamePascal = inputToPascalCase(input);
  
    const editor = await openTextDocument(uri);
    if (!editor) {
      return;
    }

    const currentText = editor.document.getText();
    const classNameRegExp = /class\s+(\w+)/;
    const match = classNameRegExp.exec(currentText);
    if (!match) {
      return;
    }
  
    const currentClassName = match[1];
    const currentUri = editor.document.uri;
    const updater = new NameUpdater(currentUri, currentClassName, newNamePascal);

    const newUri = await updater.renameFile();
    await updater.updateInstances(newUri);
  
    const excludedFolders = getExcludedFolders().join(',');
    const allDartFiles = await vscode.workspace.findFiles('**/*.dart', excludedFolders);
    for (const uri of allDartFiles) {
      await updater.updateInstances(uri);
    }
  };

async function showInputBox(prompt: string): Promise<string | undefined> {
  return await vscode.window.showInputBox({ prompt: prompt });
}

async function openTextDocument(uri: vscode.Uri): Promise<vscode.TextEditor | undefined> {
  const document = await vscode.workspace.openTextDocument(uri);
  return await vscode.window.showTextDocument(document);
}

function getNameRegex(editor: vscode.TextEditor): RegExpExecArray | null {
  const currentText = editor.document.getText();
  const classNameRegExp = /class\s+(\w+)/;
  return classNameRegExp.exec(currentText);
}