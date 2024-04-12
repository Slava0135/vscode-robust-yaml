import * as vscode from "vscode";

export const componentUris: Set<vscode.Uri> = new Set();

export function init(): vscode.Disposable[] {

    const componentRegex = new RegExp(/.*Component[.]cs/);
    const disposables: vscode.Disposable[] = [];

    vscode.workspace.findFiles("**/*Component.cs").then(addUris);

    disposables.push(vscode.workspace.onDidCreateFiles(event =>
        event.files
            .filter(it => componentRegex.test(it.toString()))
            .forEach(it => componentUris.add(it))
    ));

    disposables.push(vscode.workspace.onDidDeleteFiles(event => remUris(event.files)));
    disposables.push(vscode.workspace.onDidRenameFiles(event => {
        remUris(event.files.map(it => it.oldUri));
        addUris(event.files.map(it => it.newUri));
    }));
    
    return disposables;
}

function addUris(uris: readonly vscode.Uri[]) {
    uris.forEach(it => componentUris.add(it));
};

function remUris(uris: readonly vscode.Uri[]) {
    uris.forEach(it => componentUris.delete(it));
}