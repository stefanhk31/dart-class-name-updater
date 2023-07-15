import { title } from "case";
import { CancellationToken, CodeAction, CodeActionContext, CodeActionKind, CodeActionProvider, Command, ProviderResult, Range, Selection, TextDocument } from "vscode";

export class CodeActionManager implements CodeActionProvider {
    provideCodeActions(_document: TextDocument,
        _range: Range | Selection, 
        _context: CodeActionContext, 
        _token: CancellationToken): ProviderResult<(CodeAction | Command)[]> {
            const title = "Rename Dart File, Class & Instances";
            const action = new CodeAction(title, CodeActionKind.Refactor);
            action.command = {
                command: "dart-class-name-updater.updateAllInstancesOfClass",
                title: title
            };
          
            return [ action ];
    }
    resolveCodeAction?(_codeAction: CodeAction, _token: CancellationToken): ProviderResult<CodeAction> {
        throw new Error("Method not implemented.");
    }

}