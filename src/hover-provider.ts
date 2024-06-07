import * as vscode from 'vscode';
import { findComponent } from './yaml/find-component/find-component';
import { Position } from './range/position';
import { containsComponentDefinition } from './file/uri';
import { parseSummary } from './parse/summary';
import { componentUris } from './uri-store';

export function registerHoverProvider() {
    return vscode.languages.registerHoverProvider('yaml', {
        provideHover(document, position, _token) {
            const contents: vscode.MarkdownString[] = [];
            const component = findComponent(document.getText(), new Position(position.line, position.character));
            if (component) {
                const uri = Array.from(componentUris).find(uri => containsComponentDefinition(uri.toString(), component.toString()));
                if (uri) {
                    contents.push(new vscode.MarkdownString(`#### ${component.toString()}Component`));
                    return vscode.workspace.fs.readFile(uri).then(buf => {
                        if (buf) {
                            const summary = parseSummary(buf.toString(), component.toString());
                            if (summary) {
                                contents.push(new vscode.MarkdownString("```xml\n" + summary + "\n```"));
                            }
                            return {
                                contents: contents
                            };
                        }
                    });
                } else {
                    contents.push(new vscode.MarkdownString(`???`));
                }
                return {
                    contents: contents
                };
            }
        }
    });
}
