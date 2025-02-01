const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6})$/);

export function isHexColor(str: string): boolean {
    return hexRegex.test(str);
}
