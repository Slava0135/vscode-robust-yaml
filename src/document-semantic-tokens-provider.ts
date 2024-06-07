import * as vscode from 'vscode';
import { findAllComponents } from './yaml/find-component/find-component';

const tokenTypes: string[] = ['type'];
const tokenModifiers: string[] = [];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

export function registerDocumentSemanticTokensProvider(): vscode.Disposable {
    return vscode.languages.registerDocumentSemanticTokensProvider(
        'yaml', {
        provideDocumentSemanticTokens(document, _) {
            const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
            findAllComponents(document.getText()).forEach(c => {
                tokensBuilder.push(
                    new vscode.Range(new vscode.Position(c.start.line, c.start.character), new vscode.Position(c.end.line, c.end.character + 1)),
                    'type',
                    []
                );
            });
            return tokensBuilder.build();
        },
    },
        legend
    );
}
