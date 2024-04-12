export function parseSummary(source: string, component: string): string | undefined {
    const regex = new RegExp(/(?:\/\/\/\s*<summary>([\s\S]*)\/\/\/\s<\/summary>)[\s\S]*\s*:\s*Component/);
    const match = source.match(regex);
    if (match) {
        return match[1];
    } else {
        return;
    }
}