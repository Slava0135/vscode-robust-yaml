export function containsComponentDefinition(uri: string, name: string): boolean {
    const str = `.*${name}Component\.cs`.toLowerCase();
    const regex = new RegExp(str);
    return regex.test(uri.toLowerCase());
}