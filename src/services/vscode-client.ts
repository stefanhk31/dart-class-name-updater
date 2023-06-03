import * as vscode from 'vscode';

export class VsCodeClient {
    public async showInputBox(prompt: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({ prompt: prompt });
    }

    public async openTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument | undefined>{
        return await vscode.workspace.openTextDocument(uri);
    }

    public getDocumentText(document: vscode.TextDocument): string {
        return document.getText();
    }
} 