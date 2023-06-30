import * as vscode from 'vscode';

export class MockTextDocument implements vscode.TextDocument {
    uri: vscode.Uri;
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    isClosed: boolean;
    eol: vscode.EndOfLine;
    lineCount: number;

    constructor(
        uri: vscode.Uri,
        fileName: string,
        isUntitled: boolean = false,
        languageId: string = 'eng',
        version: number = 1,
        isDirty: boolean = false,
        isClosed: boolean = false,
        eol: vscode.EndOfLine = vscode.EndOfLine.LF,
        lineCount: number = 1,
    ) {
        this.uri = uri;
        this.fileName = fileName;
        this.isUntitled = isUntitled;
        this.languageId = languageId;
        this.version = version;
        this.isDirty = isDirty;
        this.isClosed = isClosed;
        this.eol = eol;
        this.lineCount = lineCount;
    }

    save(): Thenable<boolean> {
        throw new Error('Method not implemented.');
    }
    lineAt(line: number): vscode.TextLine;
    lineAt(position: vscode.Position): vscode.TextLine;
    lineAt(position: unknown): vscode.TextLine {
        throw new Error('Method not implemented.');
    }
    offsetAt(position: vscode.Position): number {
        throw new Error('Method not implemented.');
    }
    positionAt(offset: number): vscode.Position {
        throw new Error('Method not implemented.');
    }
    getText(range?: vscode.Range | undefined): string {
        return `
         class MyTestClass {
            const MyTestClass({required String myTestClassId});

            final String myTestClassId;
         }
        `;
    }
    getWordRangeAtPosition(position: vscode.Position, regex?: RegExp | undefined): vscode.Range | undefined {
        throw new Error('Method not implemented.');
    }
    validateRange(range: vscode.Range): vscode.Range {
        throw new Error('Method not implemented.');
    }
    validatePosition(position: vscode.Position): vscode.Position {
        throw new Error('Method not implemented.');
    }

}
