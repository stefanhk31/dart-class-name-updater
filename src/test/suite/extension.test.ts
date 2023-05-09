import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('activating adds command to subscriptions', async () => {
		const extension = vscode.extensions.getExtension("dart-class-name-updater");
		const context = await extension!.activate() as vscode.ExtensionContext;

		assert.equal(context.subscriptions.length, 1);
	});
});
