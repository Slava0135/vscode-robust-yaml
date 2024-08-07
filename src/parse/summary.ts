import { parseDataFields } from "./datafield";

export function parseComponentSummary(source: string, component: string): string | undefined {
    const lines = source.split('\n');
    const componentRegex = new RegExp(`.*${component}Component\\s*:\\s*Component.*`);
    let componentIndex = -1;
    for (let index = 0; index < lines.length; index++) {
        if (componentRegex.test(lines[index])) {
            componentIndex = index;
            break;
        }
    }
    if (componentIndex < 0) {
        return;
    }
    return parseSummaryAt(lines, componentIndex);
}

export function parseDatafieldSummary(source: string, datafield: string): string | undefined {
    const datafields = parseDataFields(source);
    const df = datafields.find(v => v.name === datafield);
    if (!df) {
        return;
    }
    const lines = source.split('\n');
    const line = df.line-1;
    let until = 0;
    for (let i = line-1; i >= 0; i--) {
        if (lines[i].trimEnd().endsWith(';') || lines[i].includes('{') || lines[i].includes('}')) {
            until = i;
            break;
        }
    }
    return parseSummaryAt(lines, line, until);
}

function parseSummaryAt(lines: string[], pos: number, until: number = 0): string | undefined {
    let summaryStartIndex = -1;
    let summaryEndIndex = -1;
    const summaryStartRegex = new RegExp(/\s*\/\/\/\s*<summary>.*/);
    const summaryEndRegex = new RegExp(/\s*\/\/\/\s*<\/summary>.*/);
    for (let index = pos-1; index >= until; index--) {
        if (summaryStartRegex.test(lines[index])) {
            summaryStartIndex = index;
        }
        if (summaryEndRegex.test(lines[index])) {
            summaryEndIndex = index;
        }
        if (summaryStartIndex > 0 && summaryEndIndex > 0) {
            return lines.slice(summaryStartIndex + 1, summaryEndIndex).map(it => it.replace(/^\s*\/\/\/\s*/, '').replace(/\s*$/, '')).join('\n');
        }
    }
}
