import * as vscode from 'vscode';
import { commands, ExtensionContext, } from 'vscode';
import { CommandManager } from './commands/update-all-instances-of-class-name';

export function activate(context: ExtensionContext) {
  const updateAllInstancesOfClassNameCommand = commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', (uri: vscode.Uri) => {
    new CommandManager().updateCommand(uri);
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}