export function wrapError(str: string): string {
    return `— ${str} —`;
}

export function codeBlock(lang: string, str: string): string {
    return `\`\`\`${lang}\n${str}\n\`\`\``;
}
