import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { instance, mock, when } from 'ts-mockito';

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
		test('updating calls rename file', async () => {
			assert.equal(true, false);
		});

		test('updating calls update instances on the updated file', async () => {
			assert.equal(true, false);
		});

		test('updating calls update instances on all files in project', async () => {
			assert.equal(true, false);
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
