const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/);

export class Color {

    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number | undefined;

    constructor(red: number, green: number, blue: number, alpha?: number | undefined) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    public equals(other: Color): boolean {
        return this.red === other.red && this.green === other.green && this.blue === other.blue;
    }

    public toHex(): string {
        const red = Math.floor(this.red).toString(16).padStart(2, '0');
        const green = Math.floor(this.green).toString(16).padStart(2, '0');
        const blue = Math.floor(this.blue).toString(16).padStart(2, '0');
        if (this.alpha) {
            const alpha = Math.floor(this.alpha).toString(16).padStart(2, '0');
            return `#${red}${green}${blue}${alpha}`;
        } else {
            return `#${red}${green}${blue}`;
        }
    }
}

export function isHexColor(str: string): boolean {
    return hexRegex.test(str);
}

export function hexToColor(str: string): Color | undefined {
    if (isHexColor(str)) {
        const red = parseInt(str.slice(1, 2 + 1), 16);
        const blue = parseInt(str.slice(3, 4 + 1), 16);
        const green = parseInt(str.slice(5, 6 + 1), 16);
        if (str.length === 1 + 2 * 4) {
            const alpha = parseInt(str.slice(7, 8 + 1), 16);
            return new Color(red, blue, green, alpha);
        } else {
            return new Color(red, blue, green);
        }
    }
}
