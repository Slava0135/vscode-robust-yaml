export function parseDataFields(source: string): string[] {
    const datafieldPattern = new RegExp(/\[DataField\("(.*)"\)\]/, 'g');
    return Array.from(source.matchAll(datafieldPattern)).map(match => match[1]);
}
