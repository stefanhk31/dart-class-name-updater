import * as vscode from 'vscode';
import { inputToPascalCase } from '../utils/input-to-pascal-case';
import { getExcludedFolders } from '../utils/get-excluded-folders';
import { NameUpdater } from '../services/name-updater';

export class CommandManager {
  public async updateCommand(uri: vscode.Uri): Promise<boolean> {
    const input = await this.showInputBox('Enter new class name');
    if (!input) {
      return false;
    }
    console.log(`input is ${input}`);
    console.log('about to get pascal case');
    const newNamePascal = inputToPascalCase(input);
    console.log('converted input to pascal');

    const editor = await this.openTextDocument(uri);
    console.log('opened document');
    if (!editor) {
      return false;
    }

    const match = this.getNameRegex(editor);
    console.log('got name regex');
    if (!match) {
      return false;
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

    return true;
  }

  public async showInputBox(prompt: string): Promise<string | undefined> {
    return await vscode.window.showInputBox({ prompt: prompt });
  }
  
  public async openTextDocument(uri: vscode.Uri): Promise<vscode.TextEditor | undefined> {
    console.log('about to get document');
    const document = await vscode.workspace.openTextDocument(uri);
    console.log(`document is ${document.toString()}`);
    return await vscode.window.showTextDocument(document);
  }
  
  public getNameRegex(editor: vscode.TextEditor): RegExpExecArray | null {
    const currentText = editor.document.getText();
    const classNameRegExp = /class\s+(\w+)/;
    return classNameRegExp.exec(currentText);
  }
}

// export const updateAllInstancesOfClassName = async (uri: vscode.Uri) => {
//     const input = await showInputBox('Enter new class name');
//     if (!input) {
//       return;
//     }
  
//     const newNamePascal = inputToPascalCase(input);
  
//     const editor = await openTextDocument(uri);
//     if (!editor) {
//       return;
//     }

//     const match = getNameRegex(editor);
//     if (!match) {
//       return;
//     }
  
//     const currentClassName = match[1];
//     const currentUri = editor.document.uri;
//     const updater = new NameUpdater(currentUri, currentClassName, newNamePascal);

//     const newUri = await updater.renameFile();
//     await updater.updateInstances(newUri);
  
//     const excludedFolders = getExcludedFolders().join(',');
//     const allDartFiles = await vscode.workspace.findFiles('**/*.dart', excludedFolders);
//     for (const uri of allDartFiles) {
//       await updater.updateInstances(uri);
//     }
//   };

