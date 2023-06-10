import * as vscode from 'vscode';

export interface IVsCodeClient {
    showInputBox(prompt: string): Promise<string | undefined>;
    openTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument | undefined>;
    getDocumentText(document: vscode.TextDocument): string;
    createUriFromFile(path: string): vscode.Uri;
    renameFile(uri: vscode.Uri, newUri: vscode.Uri): Promise<vscode.Uri>;
    readFile(uri: vscode.Uri): Promise<Uint8Array>;
    writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void>;
}   

export class VsCodeClient implements IVsCodeClient {
    public async showInputBox(prompt: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({ prompt: prompt });
    }

    public async openTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument | undefined> {
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

    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        return await vscode.workspace.fs.readFile(uri);
    }

    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        vscode.workspace.fs.writeFile(uri, content);
    }
} 