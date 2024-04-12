import * as vscode from 'vscode';
import { findComponent, isAtComponentType } from './yaml/find-component/find-component';
import { Position } from './range/position';

export function registreCompletionItemProvider(): vscode.Disposable {
    return vscode.languages.registerCompletionItemProvider('yaml', {
		provideCompletionItems(document, position, token, context) {
			return vscode.workspace.findFiles("**/*Component.cs").then((componentFiles) => {
				const list: vscode.CompletionItem[] = [];
				if (!isAtComponentType(document.getText(), new Position(position.line, position.character))) {
					return list;
				}
				const componentNameRegex = RegExp(/.*\/([a-zA-Z_]+)Component[.]cs/);
				componentFiles.forEach(uri => {
					const match = uri.toString().match(componentNameRegex);
					if (match) {
						list.push(new vscode.CompletionItem(match[1]));
					}
				});
				return list;
			});
		}
	});
}
