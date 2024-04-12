export function parseSummary(source: string, component: string): string | undefined {
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
    let summaryStartIndex = -1;
    let summaryEndIndex = -1;
    const summaryStartRegex = new RegExp(/\s*\/\/\/\s*<summary>.*/);
    const summaryEndRegex = new RegExp(/\s*\/\/\/\s*<\/summary>.*/);
    for (let index = 0; index < componentIndex; index++) {
        if (summaryStartRegex.test(lines[index])) {
            summaryStartIndex = index;
        }
        if (summaryEndRegex.test(lines[index])) {
            summaryEndIndex = index;
        }
    }
    if (summaryStartIndex > 0 && summaryEndIndex > 0) {
        return lines.slice(summaryStartIndex+1, summaryEndIndex).map(it => it.replace(/^\s*\/\/\/\s*/, '').replace(/\s*$/, '')).join('\n');
    }
}