import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { instance, mock, when } from 'ts-mockito';
import { CommandManager } from '../../commands/update-all-instances-of-class-name';
import { IVsCodeClient, VsCodeClient } from '../../services/vscode-client';

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
			const testUri = vscode.Uri.parse('test');
			mockClient = mock(VsCodeClient);
			let document: vscode.TextDocument = mock();
			when(mockClient.showInputBox('Enter new class name')).thenResolve('mocked input');
			when(mockClient.openTextDocument(testUri)).thenResolve(document);
			when(mockClient.getDocumentText(document)).thenReturn('class MyTestClass');
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
