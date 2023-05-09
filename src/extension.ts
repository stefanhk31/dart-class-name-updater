import * as vscode from 'vscode';
import { commands, ExtensionContext, } from 'vscode';
import { updateAllInstancesOfClassName } from './commands/update-all-instances-of-class-name';

export function activate(context: ExtensionContext) {
  // Set context as a global as some tests depend on it
  (global as any).testExtensionContext = context;
  const updateAllInstancesOfClassNameCommand = commands.registerCommand('dart-class-name-updater.updateAllInstancesOfClass', (uri: vscode.Uri) => {
    updateAllInstancesOfClassName(uri);
  });
  context.subscriptions.push(updateAllInstancesOfClassNameCommand);
}