import * as vscode from 'vscode';
import { findAllColors } from './yaml/find/find';
import { Color } from './color/color';

export function registerDocumentColorProvider(): vscode.Disposable {
    return vscode.languages.registerColorProvider('yaml', {
        provideColorPresentations(color, _context, _token) {
            let colorHex: string;
            if (color.alpha === 1) {
                colorHex = new Color(255 * color.red, 255 * color.green, 255 * color.blue).toHex();
            } else {
                colorHex = new Color(255 * color.red, 255 * color.green, 255 * color.blue, 255 * color.alpha).toHex();
            }
            return [{
                label: `"${colorHex}"`
            }];
        },
        provideDocumentColors(document, _token) {
            const colors: vscode.ColorInformation[] = [];
            findAllColors(document.getText()).forEach(([color, range]) => {
                let colorVsc: vscode.Color;
                if (color.alpha) {
                    colorVsc = new vscode.Color(color.red / 255, color.green / 255, color.blue / 255, color.alpha / 255);
                } else {
                    colorVsc = new vscode.Color(color.red / 255, color.green / 255, color.blue / 255, 1);
                }
                colors.push(new vscode.ColorInformation(
                    new vscode.Range(new vscode.Position(range.start.line, range.start.character), new vscode.Position(range.end.line, range.end.character + 1)),
                    colorVsc)
                );
            });
            return colors;
        },
    });
}