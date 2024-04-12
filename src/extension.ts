import * as vscode from 'vscode';
import { registerDefinitionProvider } from './definition-provider';
import { registerDocumentSemanticTokensProvider } from './document-semantic-tokens-provider';
import { registerHoverProvider } from './hover-provider';
import { registreCompletionItemProvider } from './completion-item-provider';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	context.subscriptions.push(registerDefinitionProvider());
	context.subscriptions.push(registerDocumentSemanticTokensProvider());
	context.subscriptions.push(registerHoverProvider());
	context.subscriptions.push(registreCompletionItemProvider());
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
