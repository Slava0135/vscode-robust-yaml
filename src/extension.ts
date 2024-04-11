import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	let disposable = vscode.languages.registerHoverProvider('yaml', {
		provideHover(document, position, token) {
			return {
			  contents: ['Hover Content']
			};
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
