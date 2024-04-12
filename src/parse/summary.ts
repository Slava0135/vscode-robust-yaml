export function parseSummary(source: string, component: string): string | undefined {
    const docComment = '\\/\\/\\/\\s*';
    const matchAny = '[\\s\\S]*';
    const regex = new RegExp(`${docComment}<summary>\\s*(${matchAny})${docComment}<\\/summary>${matchAny}${component}Component\\s*:\\s*Component`);
    const match = source.match(regex);
    if (match) {
        return match[1].replace(/^\/\/\/\s*/, '').replace(/\s*$/, '');
    } else {
        return;
    }
}