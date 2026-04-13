import * as vscode from 'vscode';


export interface IVsCodeClientOverrides {
    showInputBoxOverride?: string | Error;
    showQuickPickOverride?: string | Error;
    openTextDocumentOverride?: vscode.TextDocument | Error;
    getDocumentTextOverride?: string | Error;
    createUriFromFileOverride?: vscode.Uri | Error;
    renameFileOverride?: vscode.Uri | Error;
    readFileOverride?:  string | Error;
    writeFileOverride?: null | Error;
}