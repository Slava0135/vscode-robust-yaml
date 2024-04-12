import * as vscode from 'vscode';
import { registerDefinitionProvider } from './definition-provider';
import { registerDocumentSemanticTokensProvider } from './document-semantic-tokens-provider';
import { registerHoverProvider } from './hover-provider';
import { registreCompletionItemProvider } from './completion-item-provider';
import * as uristore from './uri-store';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	uristore.init().forEach(it => context.subscriptions.push(it));
	context.subscriptions.push(registerDefinitionProvider());
	context.subscriptions.push(registerDocumentSemanticTokensProvider());
	context.subscriptions.push(registerHoverProvider());
	context.subscriptions.push(registreCompletionItemProvider());
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
