import * as vscode from 'vscode';
import { IVsCodeClient } from '../services/vscode-client';

export const renameFile = async (uri: vscode.Uri, newName: string, client: IVsCodeClient): Promise<vscode.Uri> => {
    const casing = require('case');

    const currentPath = uri.path;
    const currentFolderUri = client.createUriFromFile(currentPath.substring(0, currentPath.lastIndexOf('/')));
    const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${casing.snake(newName)}.dart`);
    const newUri = currentFolderUri.with({ path: newFilename });

    return await client.renameFile(uri, newUri);
  };