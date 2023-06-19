import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { anyOfClass, anyString, anything, instance, mock, notNull, when } from 'ts-mockito';
import { CommandManager } from '../../commands/command-manager';
import { IVsCodeClient, VsCodeClient } from '../../services/vscode-client';
import { MockTextDocument } from '../fixtures/mock-text-document';
import { filePath, newFilePath, newUri, uri } from '../fixtures/constants';
import { mockVsCodeClient } from '../fixtures/mock-vs-code-client';
import { CaseObject } from '../../utils/case-object';
import { inputToPascalCase } from '../../utils/input-to-pascal-case';
import { existsSync } from 'fs';

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
			let commandManager: CommandManager;

			test('returns true if all operations succeed', async () => {		
				commandManager = new CommandManager(mockVsCodeClient({}));
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

	suite('utils', () => {
		suite('case object', () => {
			test('can implement case object interface', async () => {
				const impl: CaseObject = {
					camel: (_) => '',
					capital:  (_) => '',
					constant: (_) => '',
					header: (_) => '',
					kebab: (_) => '',
					lower: (_) => '',
					pascal: (_) => '',
					sentence: (_) => '',
					snake: (_) => '',
					title: (_) => '',
					upper: (_) => '',
					of: (_) => ''
				};
				assert.equal(!impl, false);
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
			test('can convert input with spaces to pascal case', async () => {
				assert.equal(inputToPascalCase('my test input'), 'MyTestInput');
			});
			
			test('can convert input camel case to pascal case', async () => {
				assert.equal(inputToPascalCase('myTestInput'), 'MyTestInput');
			});

			// TODO (#32): this is failing because it's currently unsupported.
			// Let's get it passing.
			test('can convert input snake case to pascal case', async () => {
				assert.equal(inputToPascalCase('my_test_input'), 'MyTestInput');
			});

			test('preserves pascal case when input is pascal', async () => {
				assert.equal(inputToPascalCase('MyTestInput'), 'MyTestInput');
			});
		});

		suite('rename file', () => {

		});

		suite('update all instances', () => {

		});

	});
});
