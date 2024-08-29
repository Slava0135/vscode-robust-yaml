import * as vscode from 'vscode';
import { findAllFields, findComponent, findComponentByField, findField, isAtComponentField } from './yaml/find/find';
import { Position } from './range/position';
import { containsComponentDefinition } from './file/path';
import { parseComponentSummary, parseDatafieldSummary } from './parse/summary';
import { getComponentUris } from './uri-store';
import { logger } from './logging';
import { parseDataFields } from './parse/datafield';
import { codeBlock, wrapError } from './markdown/markdown';

export function registerHoverProvider() {
    return vscode.languages.registerHoverProvider('yaml', {
        provideHover(document, position, _token) {
            logger.debug(`providing hover in ${document.uri.toString()} at ${position.line}:${position.character}`);
            const contents: vscode.MarkdownString[] = [];
            const pos = new Position(position.line, position.character);
            const component = findComponent(document.getText(), pos);
            if (component) {
                const uri = getComponentUris().find(uri => containsComponentDefinition(uri.toString(), component.toString()));
                if (uri) {
                    contents.push(new vscode.MarkdownString(`#### ${component.toString()}Component`));
                    return vscode.workspace.fs.readFile(uri).then(buf => {
                        if (buf) {
                            const summary = parseComponentSummary(buf.toString(), component.toString());
                            if (summary) {
                                contents.push(new vscode.MarkdownString(codeBlock('xml', summary)));
                            } else {
                                contents.push(new vscode.MarkdownString(wrapError('no description')));
                            }
                            return {
                                contents: contents
                            };
                        }
                    });
                } else {
                    contents.push(new vscode.MarkdownString(wrapError('unknown component')));
                }
                return {
                    contents: contents
                };
            } else if (isAtComponentField(document.getText(), pos)) {
                const componentName = findComponentByField(document.getText(), pos);
                const datafieldName = findField(document.getText(), pos);
                contents.push(new vscode.MarkdownString(wrapError('unknown datafield')));
                if (componentName && datafieldName) {
                    const uri = getComponentUris().find(uri => containsComponentDefinition(uri.toString(), componentName));
                    if (uri) {
                        return vscode.workspace.fs.readFile(uri).then(buf => {
                            if (buf) {
                                const datafield = parseDataFields(buf.toString()).find(it => it.name === datafieldName);
                                if (datafield) {
                                    contents.pop();
                                    if (datafield.type) {
                                        contents.push(new vscode.MarkdownString(`${codeBlock('csharp', datafield.type)}`));
                                    } else {
                                        contents.push(new vscode.MarkdownString(`**${wrapError('unknown type')}**`));
                                    }
                                    contents.push(new vscode.MarkdownString("---"));
                                    const summary = parseDatafieldSummary(buf.toString(), datafieldName);
                                    if (summary) {
                                        contents.push(new vscode.MarkdownString(codeBlock('xml', summary)));
                                    } else {
                                        contents.push(new vscode.MarkdownString(wrapError('no description')));
                                    }
                                }
                                return {
                                    contents: contents
                                };
                            }
                        });
                    }
                } 
                return {
                    contents: contents
                };
            }
        }
    });
}
