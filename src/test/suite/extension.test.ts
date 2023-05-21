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

		});

		test('updating calls update instances on the updated file', async () => {

		});

		test('updating calls update instances on all files in project', async () => {

		});
	});

	group('name updater', () => {
		test('can be instantiated', async () => {

		});

		test('creates snake case name on instantiation', async () => {

		});

		test('can rename file', async () => {

		});

		test('can update instances of classname in file', async () => {

		});
	});

	group('utils', () => {
		test('can implement case object interface', async () => {

		});

		test('can get excluded folders', async () => {

		});

		test('can convert input to pascal case', async () => {

		});
	});

});
