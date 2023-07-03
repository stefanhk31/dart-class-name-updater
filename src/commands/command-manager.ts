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
    try {
      const input = await this.client.showInputBox('Enter new class name');

      if (!input) {
        throw Error('Please enter a new class name.');
      }

      const newNamePascal = inputToPascalCase(input);
      const document = await this.client.openTextDocument(uri);
      const currentText = this.client.getDocumentText(document);
      const classNameRegExp = /class\s+(\w+)/;

      const match = classNameRegExp.exec(currentText);

      if (!match) {
        throw Error('No valid class name found in document.');
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
    } catch (e) {
      await this.client.showErrorMessage((e as Error).message);
      return false;
    }
  }
}