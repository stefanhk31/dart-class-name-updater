import * as vscode from 'vscode';
import { inputToPascalCase } from '../utils/input-to-pascal-case';
import { getExcludedFolders } from '../utils/get-excluded-folders';
import { NameUpdater } from '../services/name-updater';

export const updateAllInstancesOfClassName = async (uri: vscode.Uri) => {
    const input = await vscode.window.showInputBox({ prompt: 'Enter new class name' });
    if (!input) {
      return;
    }
  
    const newNamePascal = inputToPascalCase(input);
  
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
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