import * as vscode from 'vscode';
import { findComponent } from './yaml/find-component/find-component';
import { Position } from './range/position';

export function activate(context: vscode.ExtensionContext) {
	console.log('"robust-yaml" is now active!');
	context.subscriptions.push(vscode.languages.registerDefinitionProvider('yaml', {
		provideDefinition(document, position, token) {
			return vscode.workspace.findFiles("**/*Component.cs").then((componentFiles) => {
				const locations: vscode.Location[] = [];
				const component = findComponent(document.getText(), new Position(position.line, position.character));
				if (component) {
					componentFiles
						.filter(uri => uri.toString().includes(component.toString()))
						.forEach(uri => locations.push(new vscode.Location(uri, new vscode.Position(0, 0))));
				}
				return locations;
			}, _ => {
				return [];
			});
		},
	}));
}

export function deactivate() {
	console.log('"robust-yaml" is now deactivated!');
}
