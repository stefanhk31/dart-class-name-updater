import * as vscode from 'vscode';
import { inputToPascalCase } from '../utils/input-to-pascal-case';
import { getExcludedFolders } from '../utils/get-excluded-folders';
import { IVsCodeClient } from '../services/vscode-client';
import { renameFile } from '../utils/rename-file';
import { updateAllInstances } from '../utils/update-all-instances';

export class CommandManager {
  private client: IVsCodeClient;

  constructor(
    client: IVsCodeClient,
  ) {
    this.client = client;
  }

  public async updateCommand(uri: vscode.Uri): Promise<boolean> {
    const input = await this.client.showInputBox('Enter new class name');
    if (!input) {
      return false;
    }

    const newNamePascal = inputToPascalCase(input);

    const document = await this.client.openTextDocument(uri);
    if (!document) {
      return false;
    }

    const currentText = document.getText();
    const classNameRegExp = /class\s+(\w+)/;
    const match = classNameRegExp.exec(currentText);

    if (!match) {
      return false;
    }
  
    const currentClassName = match[1];

    const newUri = await renameFile(uri, newNamePascal, this.client);
    await updateAllInstances(newUri, currentClassName, newNamePascal, this.client);
  
    const excludedFolders = getExcludedFolders().join(',');
    const allDartFiles = await vscode.workspace.findFiles('**/*.dart', excludedFolders);
    for (const uri of allDartFiles) {
      await updateAllInstances(uri, currentClassName, newNamePascal, this.client);
    }

    return true;
  }
}