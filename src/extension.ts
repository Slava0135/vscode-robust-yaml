import * as vscode from 'vscode';
import { isScalar, isCollection, parseDocument, visit } from 'yaml';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	let disposable = vscode.languages.registerHoverProvider('yaml', {
		provideHover(document, position, token) {
			return vscode.workspace.findFiles("**/*Component.cs").then((componentFiles) => {
				let doc = parseDocument(document.getText());
				let contents: vscode.MarkdownString[] = [];
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
											let componentName = pair.value.toString();
											contents.push(new vscode.MarkdownString("### " + componentName));
											let filename = componentFiles.find((v) => v.toString().includes(componentName));
											if (filename) {
												contents.push(new vscode.MarkdownString("* " + filename.toString()));
											} else {
												contents.push(new vscode.MarkdownString("* NOT FOUND"));
											}
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
			}, (reason) => {
				return { contents: [ "FAILED TO READ SOURCE FILES: " + reason ] };
			}
		);
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
