import * as vscode from 'vscode';
import { findComponent } from './yaml/find-component/find-component';
import { Position } from './range/position';
import { containsComponentDefinition } from './file/uri';
import { componentUris } from './uri-store';
import { logger } from './logging';

export function registerDefinitionProvider(): vscode.Disposable {
	return vscode.languages.registerDefinitionProvider('yaml', {
		provideDefinition(document, position, _token) {
			logger.debug(`providing definition in ${document.uri.toString()} at ${position.line}:${position.character}`);
			const locations: vscode.Location[] = [];
			const component = findComponent(document.getText(), new Position(position.line, position.character));
			if (component) {
				Array.from(componentUris)
					.filter(uri => containsComponentDefinition(uri, component.toString()))
					.forEach(uri => locations.push(new vscode.Location(vscode.Uri.file(uri), new vscode.Position(0, 0))));
			}
			return locations;
		}
	});
}
