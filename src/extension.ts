import * as vscode from 'vscode';
import { registerDefinitionProvider } from './definition-provider';
import { registerDocumentSemanticTokensProvider } from './document-semantic-tokens-provider';
import { registerHoverProvider } from './hover-provider';
import { registerCompletionItemProvider } from './completion-item-provider';
import * as uristore from './uri-store';
import { logger } from './logging';
import * as logging from './logging';
import * as configuration from './configuration';

export function activate(context: vscode.ExtensionContext) {
	initLogging(context);
	logger.info("activating extension...");
	uristore.init().forEach(it => context.subscriptions.push(it));
	context.subscriptions.push(registerDefinitionProvider());
	context.subscriptions.push(registerDocumentSemanticTokensProvider());
	context.subscriptions.push(registerHoverProvider());
	context.subscriptions.push(registerCompletionItemProvider());
	logger.info("extension activated!");
}

function initLogging(context: vscode.ExtensionContext) {
	function setLogLevel() {
		let logLevel = configuration.getLogLevel();
		logging.setLevel(logLevel);
	}
	logging.init(vscode.window.createOutputChannel("Robust YAML", "log"));
	setLogLevel();
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (configuration.didAffectLogLevel(e)) {
				setLogLevel();
			}
		})
	);
}
