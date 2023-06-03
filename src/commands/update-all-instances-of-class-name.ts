import * as vscode from 'vscode';
import { inputToPascalCase } from '../utils/input-to-pascal-case';
import { getExcludedFolders } from '../utils/get-excluded-folders';
import { NameUpdater } from '../services/name-updater';
import { VsCodeClient } from '../services/vscode-client';

export class CommandManager {
  private client: VsCodeClient;

  constructor(client: VsCodeClient) {
    this.client = client;
  }

  public async updateCommand(uri: vscode.Uri): Promise<boolean> {
    const input = await this.client.showInputBox('Enter new class name');
    if (!input) {
      return false;
    }

    console.log(`input is ${input}`);

    const newNamePascal = inputToPascalCase(input);

    const document = await this.client.openTextDocument(uri);
    if (!document) {
      return false;
    }

    const currentText = this.client.getDocumentText(document);
    const classNameRegExp = /class\s+(\w+)/;
    const match = classNameRegExp.exec(currentText);

    if (!match) {
      return false;
    }
  
    const currentClassName = match[1];
    const currentUri = document.uri;
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
}