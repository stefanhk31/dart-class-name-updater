import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';
import { instance, mock, when } from 'ts-mockito';
import { group } from 'console';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	group('activate', () => {
		test('activating adds command to subscriptions', async () => {
			let mockContext:vscode.ExtensionContext = mock();
			let context = instance(mockContext);
			when(context.subscriptions).thenReturn([]);
			
			extension.activate(context);
	
			assert.equal(context.subscriptions.length, 1);
		});
	});

	group('commands', () => {
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

	group('name updater', () => {
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

	group('utils', () => {
		group('case object', () => {
			test('can implement case object interface', async () => {
				assert.equal(true, false);
			});
		});

		group('get excluded folders', () => {
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

		group('input to pascal case', () => {
			test('can convert input to pascal case', async () => {
				assert.equal(true, false);
			});
		});
	});
});
