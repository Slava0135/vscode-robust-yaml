import * as vscode from 'vscode';
import { findAllColors } from './yaml/find/find';

export function registerDocumentColorProvider(): vscode.Disposable {
    return vscode.languages.registerColorProvider('yaml', {
        provideColorPresentations() {
            return [{
                label: "Pick Color"
            }];
        },
        provideDocumentColors(document, token) {
            const colors: vscode.ColorInformation[] = [];
            findAllColors(document.getText()).forEach(([color, range]) => {
                colors.push(new vscode.ColorInformation(
                    new vscode.Range(new vscode.Position(range.start.line, range.start.character), new vscode.Position(range.end.line, range.end.character + 1)),
                    new vscode.Color(color.red / 255, color.green / 255, color.blue / 255, 1))
                );
            });
            return colors;
        },
    });
}