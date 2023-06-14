import * as vscode from 'vscode';
import { IVsCodeClient, VsCodeClient } from "../../services/vscode-client";
import { anyString, anything, instance, mock, when } from 'ts-mockito';
import { filePath, newUri, uri, document, contents } from './constants';
import { MockTextDocument } from './mock-text-document';
import { MethodStubSetter } from 'ts-mockito/lib/MethodStubSetter';
import { IVsCodeClientOverrides } from './vs-code-client-overrides';

export const mockVsCodeClient = 
({
  showInputBoxOverride = 'my new test class', 
  openTextDocumentOverride = document, 
  createUriFromFileOverride = uri, 
  renameFileOverride = newUri, 
  readFileOverride = contents,
  writeFileOverride = null,
}: IVsCodeClientOverrides): IVsCodeClient => {
    let mockClient: IVsCodeClient = mock(VsCodeClient);
    mockClient = mock(VsCodeClient);
    if (showInputBoxOverride instanceof(Error)) {
        when(mockClient.showInputBox('Enter new class name')).thenThrow(showInputBoxOverride);
    } else {
        when(mockClient.showInputBox('Enter new class name')).thenResolve(showInputBoxOverride);
    }

    if (openTextDocumentOverride instanceof(Error)) {
        when(mockClient.openTextDocument(uri)).thenThrow(openTextDocumentOverride);
    } else {
        when(mockClient.openTextDocument(uri)).thenResolve(openTextDocumentOverride);
    }

    if (createUriFromFileOverride instanceof(Error)) {
        when(mockClient.createUriFromFile(anyString())).thenThrow(createUriFromFileOverride);
    } else {
        when(mockClient.createUriFromFile(anyString())).thenReturn(createUriFromFileOverride);
    }

    if (renameFileOverride instanceof(Error)) {
        when(mockClient.renameFile(anything(), anything()))
        .thenThrow(renameFileOverride);
    } else {
        when(mockClient.renameFile(anything(), anything()))
        .thenResolve(renameFileOverride);
    }

    if (readFileOverride instanceof(Error)) {
        when(mockClient.readFile(newUri)).thenThrow(readFileOverride);
    } else {
        when(mockClient.readFile(newUri)).thenResolve(readFileOverride);
    }

    if (writeFileOverride instanceof(Error)) {
        when(mockClient.writeFile(newUri, contents)).thenThrow(writeFileOverride);
    } else {
        when(mockClient.writeFile(newUri, contents)).thenResolve();
    }

    return instance(mockClient);
};