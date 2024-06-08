import * as vscode from 'vscode';
import { isAtComponentType } from './yaml/find-component/find-component';
import { Position } from './range/position';
import { getComponentUris } from './uri-store';
import { logger } from './logging';

export function registerCompletionItemProvider(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider('yaml', {
		provideCompletionItems(document, position, _token, _context) {
			logger.debug(`providing completion items in ${document.uri.toString()} at ${position.line}:${position.character}`);
			const list: vscode.CompletionItem[] = [];
			if (!isAtComponentType(document.getText(), new Position(position.line, position.character))) {
				return list;
			}
			const componentNameRegex = RegExp(/.*\/([a-zA-Z_]+)Component[.]cs/);
			getComponentUris().forEach(uri => {
				const match = uri.toString().match(componentNameRegex);
				if (match) {
					const item = {
						label: match[1],
						detail: 'Component',
					};
					list.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Constructor));
				}
			});
			return list;
		}
	});
}
