import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { anyOfClass, anyString, anything, instance, mock, spy, verify, when } from 'ts-mockito';
import { CommandManager } from '../../commands/update-all-instances-of-class-name';
import { Uri } from 'vscode';
import { setup } from 'mocha';

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
			let commandManager: CommandManager;
			let commandManagerSpy: CommandManager;
			const testUri = vscode.Uri.parse('test');
			
			setup(() => {
				commandManager = new CommandManager();
				commandManagerSpy = spy(commandManager);
				let mockTextEditor: vscode.TextEditor = mock();
				let mockDocument: vscode.TextDocument = mock();
				when(mockTextEditor.document).thenReturn(mockDocument);
				when(mockDocument.getText).thenReturn(() => 'text');
				when(commandManagerSpy.showInputBox(anyString()))
					.thenResolve('mocked input');
				when(commandManagerSpy.openTextDocument(anything()))
					.thenResolve(mockTextEditor);
			});
			
			test('calls show input box', async () => {
				await commandManager.updateCommand(testUri);
				verify(commandManagerSpy.showInputBox(anyString())).called();
			});

			test('calls input to pascal case', async () => {
				assert.equal(true, false);
			});

			test('calls open text document', async () => {
				assert.equal(true, false);
			});

			test('calls get name regex', async () => {
				assert.equal(true, false);
			});

			test('instantiates name updater', async () => {
				assert.equal(true, false);
			});

			test('calls rename file', () => {
				assert.equal(true, false);
			});

			test('calls update instances on the updated file', () => {
				assert.equal(true, false);
			});

			test('calls update instances on all files in project', async () => {
				assert.equal(true, false);
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
