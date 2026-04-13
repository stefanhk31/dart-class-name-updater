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
      const document = await this.client.openTextDocument(uri);
      const currentText = this.client.getDocumentText(document);
      const classNameRegExp = /class\s+([A-Za-z_]\w*)/g;

      const classNames = [] as string[];
      let match;

      while ((match = classNameRegExp.exec(currentText)) !== null && !classNames.includes(match[1])) {
        classNames.push(match[1]);
      }
      
      classNameRegExp.lastIndex = 0;
      
      if (classNames.length === 0) {
        throw Error('No valid class names found in document.');
      }

      const currentClassName = await this.client.showQuickPick(classNames, 'Select which class to rename');

      if (!currentClassName) {
        throw Error('Please select a class name.');
      }

      const input = await this.client.showInputBox('Enter new class name');

      if (!input) {
        throw Error('Please enter a new class name.');
      }

      const newNamePascal = inputToPascalCase(input);
      const casing = require('case');

      if (uri.path.includes(casing.snake(currentClassName))) {
        const newUri = await renameFile(uri, newNamePascal, this.client);
        uri = newUri;
      }
      await updateAllInstances(uri, currentClassName, newNamePascal, this.client);

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