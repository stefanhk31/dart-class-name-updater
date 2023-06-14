import * as vscode from 'vscode';


export interface IVsCodeClientOverrides {
    showInputBoxOverride?: string | Error;
    openTextDocumentOverride?: vscode.TextDocument | Error;
    createUriFromFileOverride?: vscode.Uri | Error;
    renameFileOverride?: vscode.Uri | Error;
    readFileOverride?:  string | Error;
    writeFileOverride?: null | Error;
}