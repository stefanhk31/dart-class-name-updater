import * as vscode from 'vscode';
import { MockTextDocument } from './mock-text-document';

export const filePath = 'my_test_class.dart';
export const uri = vscode.Uri.parse(filePath);
export const newFilePath = 'my_new_test_class.dart';
export const newUri = vscode.Uri.parse(newFilePath);
export const document = new MockTextDocument(uri, filePath);
export const contents = document.getText();
