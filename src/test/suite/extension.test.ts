import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { instance, mock, spy, when } from 'ts-mockito';
import { updateAllInstancesOfClassName } from '../../commands/update-all-instances-of-class-name';
import { Uri } from 'vscode';

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
			test('calls show input box', async () => {
				assert.equal(true, false);
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

			});

			test('calls rename file', () => {

			});

			test('calls update instances on the updated file', () => {

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
