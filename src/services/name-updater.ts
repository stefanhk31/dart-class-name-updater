import * as vscode from 'vscode';
import { CaseObject } from '../utils/case-object';
import { IVsCodeClient } from './vscode-client';

export class NameUpdater {
    private client: IVsCodeClient;
    private uri: vscode.Uri;
    private className: string;
    private newClassName: string;
    private casing: CaseObject;
    private newClassNameSnakeCase: string;

    constructor(
        client: IVsCodeClient, 
        uri: vscode.Uri, 
        className: string, 
        newClassName: string,
    ) {
        this.client = client;
        this.uri = uri;
        this.className = className;
        this.newClassName = newClassName;
        this.casing = require('case');
        this.newClassNameSnakeCase = this.casing.snake(this.newClassName);
    }

    public async renameFile(): Promise<vscode.Uri> {
        const currentPath = this.uri.path;
        const currentFolderUri = this.client.createUriFromFile(currentPath.substring(0, currentPath.lastIndexOf('/')));
        const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${this.newClassNameSnakeCase}.dart`);
        const newUri = currentFolderUri.with({ path: newFilename });

        return await this.client.renameFile(this.uri, newUri);
    }

    public async updateInstances(uri: vscode.Uri)
    : Promise<boolean> {
        const pascalRegex = new RegExp(`(${this.casing.pascal(this.className)})`, 'g');
        const snakeRegex = new RegExp(`(${this.casing.snake(this.className)})`, 'g');
        const bufferContents = await this.client.readFile(uri);
        const fileContents = bufferContents.toString();

        const newContents = fileContents.replace(
            pascalRegex, (_) => this.casing.pascal(this.newClassName)
        ).replace(
            snakeRegex, (_) => this.casing.snake(this.newClassNameSnakeCase)
        );

        await this.client.writeFile(uri, Buffer.from(newContents));

        return true;
    }
}
