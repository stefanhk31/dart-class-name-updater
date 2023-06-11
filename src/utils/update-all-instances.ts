import * as vscode from 'vscode';
import { IVsCodeClient } from '../services/vscode-client';

export const updateAllInstances = async (
    uri: vscode.Uri,
    name: string,
    newName: string,
    client: IVsCodeClient,
): Promise<boolean> => {
    const casing = require('case');

    const pascalRegex = new RegExp(`(${casing.pascal(name)})`, 'g');
    const snakeRegex = new RegExp(`(${casing.snake(name)})`, 'g');
    const fileContents = await client.readFile(uri);

    const newContents = fileContents.replace(
        pascalRegex, (_) => casing.pascal(newName)
    ).replace(
        snakeRegex, (_) => casing.snake(newName)
    );

    await client.writeFile(uri, newContents);

    return true;
  };