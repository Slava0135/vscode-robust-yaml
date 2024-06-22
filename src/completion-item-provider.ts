import * as vscode from 'vscode';
import { findComponentByField, isAtComponentField, isAtComponentType } from './yaml/find/find';
import { Position } from './range/position';
import { getComponentUris } from './uri-store';
import { logger } from './logging';
import { containsComponentDefinition } from './file/path';
import { parseDataFields } from './parse/datafield';

export function registerCompletionItemProvider(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider('yaml', {
		provideCompletionItems(document, position, _token, _context) {
			logger.debug(`providing completion items in ${document.uri.toString()} at ${position.line}:${position.character}`);
			const pos = new Position(position.line, position.character);
			if (isAtComponentType(document.getText(), pos)) {
				logger.debug(`finding items for component type...`);
				const list: vscode.CompletionItem[] = [];
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
				logger.debug(`found ${list.length} items`);
				return list;
			} else if (isAtComponentField(document.getText(), pos)) {
				logger.debug(`finding items for component field...`);
				const componentName = findComponentByField(document.getText(), pos)!!;
				const componentUris = getComponentUris().filter(uri => containsComponentDefinition(uri.toString(), componentName));
				logger.debug(`found ${componentUris.length} candidate components`);
				if (componentUris.length === 1) {
					let uri = componentUris[0];
					logger.debug(`found component type at ${uri.toString()}`);
					return vscode.workspace.fs.readFile(uri).then(buf => {
						const list: vscode.CompletionItem[] = [];
                        if (buf) {
							parseDataFields(buf.toString()).forEach(field => {
								const item = {
									label: `${field.name}: `,
									detail: `${field.type ?? ''}`
								};
								list.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Field));
							});
						}
						logger.debug(`found ${list.length} items`);
						return list;
					});
				}
			}
			return [];
		}
	});
}
