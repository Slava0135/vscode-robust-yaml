import * as vscode from 'vscode';
import { findComponent, findComponentByField, findField, findPath, isAtComponentField } from './yaml/find/find';
import { Position } from './range/position';
import { containsComponentDefinition } from './file/path';
import { getComponentUris } from './uri-store';
import { logger } from './logging';
import { parseDataFields } from './parse/datafield';

export function registerDefinitionProvider(): vscode.Disposable {
	return vscode.languages.registerDefinitionProvider('yaml', {
		provideDefinition(document, position, _token) {
			logger.debug(`providing definition in ${document.uri.toString()} at ${position.line}:${position.character}`);
			const locations: vscode.Location[] = [];
			const pos = new Position(position.line, position.character);
			const component = findComponent(document.getText(), pos);
			if (component) {
				logger.debug(`finding component definition...`);
				getComponentUris()
					.filter(uri => containsComponentDefinition(uri.toString(), component.toString()))
					.forEach(uri => locations.push(new vscode.Location(uri, new vscode.Position(0, 0))));
			} else if (isAtComponentField(document.getText(), pos)) {
				logger.debug(`finding datafield definition...`);
				const componentName = findComponentByField(document.getText(), pos);
				const datafieldName = findField(document.getText(), pos);
				if (componentName && datafieldName) {
					const components = getComponentUris().filter(uri => containsComponentDefinition(uri.toString(), componentName.toString()));
					if (components.length === 1) {
						let uri = components[0];
						return vscode.workspace.fs.readFile(uri).then(buf => {
							if (buf) {
								const datafields = parseDataFields(buf.toString());
								const datafield = datafields.find(it => it.name === datafieldName);
								if (datafield) {
									locations.push(new vscode.Location(uri, new vscode.Position(datafield.line-1, 0)));
								}
								return locations;
							}
						});
					}
				}
			} else if (findPath(document.getText(), pos)) {
				logger.debug(`finding path definition...`);
				let path = findPath(document.getText(), pos)!!;
				if (path?.startsWith('/')) {
					path = path.slice(1);
				}
				logger.debug(`searching files with path '${path}'`);
				return vscode.workspace.findFiles(`{**/${path},**/${path}/**}`).then(uris => {
					uris.forEach(it => {
						const uri = it.toString();
						if (uri.endsWith(path)) {
							locations.push(new vscode.Location(it, new vscode.Position(0, 0)));
						} else {
							const start = uri.lastIndexOf(path);
							locations.push(new vscode.Location(vscode.Uri.parse(uri.slice(0, start + path.length)), new vscode.Position(0, 0)));
						}
					});
					return locations;
				});
			}
			return locations;
		}
	});
}
