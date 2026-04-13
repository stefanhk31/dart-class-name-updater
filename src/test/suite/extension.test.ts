import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { instance, mock, verify, when } from 'ts-mockito';
import { CommandManager } from '../../commands/command-manager';
import { uri } from '../fixtures/constants';
import { mockVsCodeClient } from '../fixtures/mock-vs-code-client';
import { inputToPascalCase } from '../../utils/input-to-pascal-case';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('activate', () => {
		test('activating adds command to subscriptions', async () => {
			let mockContext: vscode.ExtensionContext = mock();
			when(mockContext.subscriptions).thenReturn([]);
			let context = instance(mockContext);

			extension.activate(context);

			assert.strictEqual(context.subscriptions.length, 1);
		});
	});

	suite('command manager', () => {
		suite('update all instances of class name', () => {
			let commandManager: CommandManager;

			test('returns true if all operations succeed', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, true);
			});

			test('returns false if open text document throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({openTextDocumentOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if get document text throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({getDocumentTextOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if input is empty', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({showInputBoxOverride: ''})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if no class name is selected', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({showQuickPickOverride: ''})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if create uri from file throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({createUriFromFileOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if rename file throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({renameFileOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if read file throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({readFileOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if write file throws error', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({writeFileOverride: Error('oops')})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('returns false if document text does not match class regex', async () => {		
				commandManager = new CommandManager(instance(mockVsCodeClient({getDocumentTextOverride: ''})));
				const result = await commandManager.updateCommand(uri);
				assert.strictEqual(result, false);
			});

			test('displays error message when error is thrown', async () => {
				const client = mockVsCodeClient({showInputBoxOverride: Error('oops')});
				commandManager = new CommandManager(instance(client));
				await commandManager.updateCommand(uri);
				verify(client.showErrorMessage('oops')).once();
			});
		});
	});

	suite('utils', () => {
		//TODO (#33): need to figure out how to set up test environment for this
		suite('get excluded folders', () => {
			test('can get excluded folders', async () => {
				assert.strictEqual(true, false);
			});

			test('excludes folders in .gitignore file', async () => {
				assert.strictEqual(true, false);
			});

			test('returns empty array when workspace is empty', async () => {
				assert.strictEqual(true, false);
			});
		});

		suite('input to pascal case', () => {
			test('can convert input with spaces to pascal case', async () => {
				assert.strictEqual(inputToPascalCase('my test input'), 'MyTestInput');
			});
			
			test('can convert input camel case to pascal case', async () => {
				assert.strictEqual(inputToPascalCase('myTestInput'), 'MyTestInput');
			});

			test('can convert input snake case to pascal case', async () => {
				assert.strictEqual(inputToPascalCase('my_test_input'), 'MyTestInput');
			});

			test('can convert input screaming snake case to pascal case', async () => {
				assert.strictEqual(inputToPascalCase('MY_TEST_INPUT'), 'MyTestInput');
			});

			test('preserves pascal case when input is pascal', async () => {
				assert.strictEqual(inputToPascalCase('MyTestInput'), 'MyTestInput');
			});
		});

		//TODO (#33): need to figure out how to set up test environment for this
		suite('rename file',  () => {
			test('renames file', async () => {		
				assert.strictEqual(true, false);		
			});
		});

		//TODO (#33): need to figure out how to set up test environment for this
		suite('update all instances', () => {
			test('updates all instances of name in project', async () => {
				assert.strictEqual(true, false);
			});
		});

	});
});
