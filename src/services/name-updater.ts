import * as vscode from 'vscode';
import * as Case from 'case';
import { CaseObject } from '../utils/case-object';


export class NameUpdater {
    private uri: vscode.Uri;
    private className: string;
    private newClassName: string;
    private casing: CaseObject;
    private newClassNameSnakeCase: string;

    constructor(uri: vscode.Uri, className: string, newClassName: string) {
        this.uri = uri;
        this.className = className;
        this.newClassName = newClassName;
        this.casing = require('case');
        this.newClassNameSnakeCase = this.casing.snake(this.newClassName);
    }

    public async renameFile(): Promise<vscode.Uri> {
        const currentPath = this.uri.path;
        const currentFolderUri = vscode.Uri.file(currentPath.substring(0, currentPath.lastIndexOf('/')));
        const newFilename = currentPath.replace(/\/(\w+)\.dart$/, `/${this.newClassNameSnakeCase}.dart`);
        const newUri = currentFolderUri.with({ path: newFilename });

        await vscode.workspace.fs.rename(this.uri, newUri);
        return newUri;
    }

    public async updateInstances(
    ): Promise<boolean> {
        const pascalRegex = new RegExp(`(${this.casing.pascal(this.className)})`, 'g');
        const snakeRegex = new RegExp(`(${this.casing.snake(this.className)})`, 'g');
        const fileContents = (await vscode.workspace.fs.readFile(this.uri)).toString();

        const newContents = fileContents.replace(
            pascalRegex, (_) => this.casing.pascal(this.newClassName)
        ).replace(
            snakeRegex, (_) => this.casing.snake(this.newClassNameSnakeCase)
        );

        await vscode.workspace.fs.writeFile(this.uri, Buffer.from(newContents));

        return true;
    }
}
