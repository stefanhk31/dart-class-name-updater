import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { anyOfClass, anyString, anything, instance, mock, when } from 'ts-mockito';
import { CommandManager } from '../../commands/command-manager';
import { IVsCodeClient, VsCodeClient } from '../../services/vscode-client';
import { MockTextDocument } from '../fixtures/mock-text-document';
import { filePath, newFilePath, newUri, uri } from '../fixtures/constants';
import { mockVsCodeClient } from '../fixtures/mock-vs-code-client';

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

	suite('command manager', () => {
		suite('update all instances of class name', () => {
			let commandManager = new CommandManager(mockVsCodeClient({}));

			test('returns true if all operations succeed', async () => {		
				const result = await commandManager.updateCommand(uri);
				assert.equal(result, true);
			});

			test('returns false if input is empty', async () => {		
				commandManager = new CommandManager(mockVsCodeClient({showInputBoxOverride: ''}));
				const result = await commandManager.updateCommand(uri);
				assert.equal(result, false);
			});

			test('returns false if open text document throws error', async () => {		
				commandManager = new CommandManager(mockVsCodeClient({openTextDocumentOverride: Error('oops')}));
				const result = await commandManager.updateCommand(uri);
				assert.equal(result, false);
			});

			test('returns false if document text does not match class regex', async () => {		
				commandManager = new CommandManager(mockVsCodeClient({getDocumentTextOverride: ''}));
				const result = await commandManager.updateCommand(uri);
				assert.equal(result, false);
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
