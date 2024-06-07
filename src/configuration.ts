import * as vscode from 'vscode';

const section = "Robust YAML";

const logLevelScope = "logger.loggingLevel";

export function getLogLevel(): string {
    return vscode.workspace.getConfiguration(section).get(logLevelScope, 'Info');
}

export function didAffectLogLevel(e: vscode.ConfigurationChangeEvent): boolean {
    return e.affectsConfiguration(section);
}
