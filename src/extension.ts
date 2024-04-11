import * as vscode from 'vscode';
import { isScalar, isCollection, parseDocument, visit } from 'yaml';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	let disposable = vscode.languages.registerHoverProvider('yaml', {
		provideHover(document, position, token) {
			let doc = parseDocument(document.getText());
			let contents: string[] = [];
			visit(doc, {
				Map(_, map) {
					if (map.range) {
						let start = document.positionAt(map.range[0]);
						let end = document.positionAt(map.range[2]);
						if (position.isBefore(start) || position.isAfter(end)) {
							return visit.SKIP;
						}
					}
					if (map.get('type') === 'entity') {
						let components = map.get('components');
						if (isCollection(components)) {
							visit(components, {
								Pair(_, pair) {
									if (isScalar(pair.key) && pair.key.value === 'type' && isScalar(pair.value)) {
										contents.push(pair.value.toString());
									}
								}
							});
						}
					}
					return visit.SKIP;
				}
			});
			return {
			  contents: contents
			};
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
