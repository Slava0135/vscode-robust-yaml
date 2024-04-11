import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
