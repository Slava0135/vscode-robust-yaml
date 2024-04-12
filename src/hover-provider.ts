import * as vscode from 'vscode';
import { findComponent } from './yaml/find-component/find-component';
import { Position } from './range/position';
import { containsComponentDefinition } from './file/uri';
import { parseSummary } from './parse/summary';

export function registerHoverProvider() {
    return vscode.languages.registerHoverProvider('yaml', {
        provideHover(document, position, token) {
            const contents: vscode.MarkdownString[] = [];
            const component = findComponent(document.getText(), new Position(position.line, position.character));
            if (component) {
                return vscode.workspace.findFiles("**/*Component.cs").then((componentFiles) => {
                    const uri = componentFiles.find(uri => containsComponentDefinition(uri.toString(), component.toString()));
                    if (uri) {
                        contents.push(new vscode.MarkdownString(`#### ${component.toString()}Component`));
                        return vscode.workspace.fs.readFile(uri);
                    } else {
                        contents.push(new vscode.MarkdownString(`???`));
                    }
                }).then(buf => {
                    if (buf) {
                        const summary = parseSummary(buf.toString(), component.toString());
                        if (summary) {
                            contents.push(new vscode.MarkdownString("```xml\n" + summary + "\n```"));
                        }
                    }
                    return {
                        contents: contents
                    };
                });
            }
        }
    });
}
