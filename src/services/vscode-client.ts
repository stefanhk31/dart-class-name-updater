import * as vscode from 'vscode';

export interface IVsCodeClient {
    showInputBox(prompt: string): Promise<string | undefined>;
    openTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument>;
    getDocumentText(document: vscode.TextDocument): string;
    createUriFromFile(path: string): vscode.Uri;
    renameFile(uri: vscode.Uri, newUri: vscode.Uri): Promise<vscode.Uri>;
    readFile(uri: vscode.Uri): Promise<String>;
    writeFile(uri: vscode.Uri, content: String): Promise<void>;
    showErrorMessage(message: string): Promise<void>;
}

export class VsCodeClient implements IVsCodeClient {

    public async showInputBox(prompt: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({ prompt: prompt });
    }

    public async openTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument> {
        return await vscode.workspace.openTextDocument(uri);
    }

    public getDocumentText(document: vscode.TextDocument): string {
        return document.getText();
    }

    public createUriFromFile(path: string): vscode.Uri {
        return vscode.Uri.file(path);
    }

    public async renameFile(uri: vscode.Uri, newUri: vscode.Uri): Promise<vscode.Uri> {
        await vscode.workspace.fs.rename(uri, newUri);
        return newUri;
    }

    public async readFile(uri: vscode.Uri): Promise<String> {
        return (await (vscode.workspace.fs.readFile(uri))).toString();
    }

    public async writeFile(uri: vscode.Uri, content: String): Promise<void> {
        vscode.workspace.fs.writeFile(uri, Buffer.from(content));
    }

    public async showErrorMessage(message: string): Promise<void> {
        await vscode.window.showErrorMessage(message);
    }
} 