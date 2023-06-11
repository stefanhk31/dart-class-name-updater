import * as vscode from 'vscode';
import { commands, ExtensionContext, } from 'vscode';
import { CommandManager } from './commands/command-manager';
import { VsCodeClient } from './services/vscode-client';

export function activate(context: ExtensionContext) {
  const updateAllInstancesOfClassNameCommand = commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', (uri: vscode.Uri) => {
    const client = new VsCodeClient();
    const commandManager = new CommandManager(client);
    commandManager.updateCommand(uri);
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}