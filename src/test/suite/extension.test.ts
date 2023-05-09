import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('activating adds command to subscriptions', async () => {
		let context: vscode.ExtensionContext;
		context = (global as any).testExtensionContext;
		extension.activate(context);

		assert.equal(context.subscriptions.length, 1);
	});
});
