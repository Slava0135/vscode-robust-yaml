import * as vscode from 'vscode';
import { registerDefinitionProvider } from './definition-provider';
import { registerDocumentSemanticTokensProvider } from './document-semantic-tokens-provider';
import { registerHoverProvider } from './hover-provider';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	context.subscriptions.push(registerDefinitionProvider());
	context.subscriptions.push(registerDocumentSemanticTokensProvider());
	context.subscriptions.push(registerHoverProvider());
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
