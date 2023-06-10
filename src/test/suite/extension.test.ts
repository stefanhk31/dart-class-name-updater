import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { anyOfClass, anyString, instance, mock, when } from 'ts-mockito';
import { CommandManager } from '../../commands/update-all-instances-of-class-name';
import { IVsCodeClient, VsCodeClient } from '../../services/vscode-client';
import { MockTextDocument } from '../fixtures/mock-text-document';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('activate', () => {
		test('activating adds command to subscriptions', async () => {
			let mockContext: vscode.ExtensionContext = mock();
			when(mockContext.subscriptions).thenReturn([]);
			let context = instance(mockContext);

			extension.activate(context);

			assert.equal(context.subscriptions.length, 1);
		});
	});

	suite('commands', () => {
		suite('update all instances of class name', () => {
			let mockClient: IVsCodeClient = mock(VsCodeClient);
			let commandManager: CommandManager;
			const testFilePath = 'my_test_class.dart';
			const testUri = vscode.Uri.parse(testFilePath);
			mockClient = mock(VsCodeClient);
			let document = new MockTextDocument(testUri, testFilePath);
			when(mockClient.showInputBox('Enter new class name')).thenResolve('my new test class');
			when(mockClient.openTextDocument(testUri)).thenResolve(document);
			when(mockClient.createUriFromFile(anyString())).thenReturn(testUri);
			when(mockClient.renameFile(anyString(), anyString()))
			  .thenResolve(vscode.Uri.parse('my_new_test_class.dart'));
			//TODO: mock readFile and writeFile
			when(mockClient.readFile(testUri)).thenResolve();
			let client = instance(mockClient);
			commandManager = new CommandManager(client);

			test('returns true if all operations succeed', async () => {		
				const result = await commandManager.updateCommand(testUri);
				assert.equal(result, true);
			});
		});
	});

	suite('name updater', () => {
		test('can be instantiated', async () => {
			assert.equal(true, false);
		});

		test('creates snake case name on instantiation', async () => {
			assert.equal(true, false);
		});

		test('can rename file', async () => {
			assert.equal(true, false);
		});

		test('can update instances of classname in file', async () => {
			assert.equal(true, false);
		});
	});

	suite('utils', () => {
		suite('case object', () => {
			test('can implement case object interface', async () => {
				assert.equal(true, false);
			});
		});

		suite('get excluded folders', () => {
			test('can get excluded folders', async () => {
				assert.equal(true, false);
			});

			test('excludes folders in .gitignore file', async () => {
				assert.equal(true, false);
			});

			test('returns empty array when workspace is empty', async () => {
				assert.equal(true, false);
			});
		});

		suite('input to pascal case', () => {
			test('can convert input to pascal case', async () => {
				assert.equal(true, false);
			});
		});
	});
});
