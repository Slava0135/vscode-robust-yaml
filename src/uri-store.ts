import * as vscode from "vscode";
import { logger } from "./logging";

export const componentUris: Set<string> = new Set();

export function init(): vscode.Disposable[] {

    const componentRegex = new RegExp(/.*Component[.]cs/);
    const disposables: vscode.Disposable[] = [];

    vscode.workspace.findFiles("**/*Component.cs").then(addUris);

    disposables.push(vscode.workspace.onDidCreateFiles(event => {
        event.files
            .filter(it => componentRegex.test(it.fsPath))
            .forEach(it => componentUris.add(it.fsPath));
    }));

    disposables.push(vscode.workspace.onDidDeleteFiles(event => {
        remUris(event.files);
    }));

    disposables.push(vscode.workspace.onDidRenameFiles(event => {
        remUris(event.files.map(it => it.oldUri));
        addUris(event.files.map(it => it.newUri).filter(it => componentRegex.test(it.toString())));
    }));

    return disposables;
}

function addUris(uris: readonly vscode.Uri[]) {
    logger.debug(`adding ${uris.length} uris to store`);
    if (uris.length === 1) {
        logger.debug(uris.toString());
    }
    let old = componentUris.size;
    uris.forEach(it => componentUris.add(it.fsPath));
    logger.debug(`store size is ${componentUris.size} (was ${old})`);
};

function remUris(uris: readonly vscode.Uri[]) {
    logger.debug(`removing ${uris.length} uris from store`);
    if (uris.length === 1) {
        logger.debug(uris.toString());
    }
    let old = componentUris.size;
    uris.forEach(it => componentUris.delete(it.fsPath));
    logger.debug(`store size is ${componentUris.size} (was ${old})`);
}
