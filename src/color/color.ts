const hexRegex = new RegExp(/^#([A-Fa-f0-9]{6})$/);

export class Color {

    readonly red: number;
    readonly green: number;
    readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    public equals(other: Color): boolean {
        return this.red === other.red && this.green === other.green && this.blue === other.blue;
    }

    public toHex(): string {
        let red = Math.floor(this.red).toString(16).padStart(2, '0');
        let green = Math.floor(this.green).toString(16).padStart(2, '0');
        let blue = Math.floor(this.blue).toString(16).padStart(2, '0');
        return `${red}${green}${blue}`;
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
        return new Color(red, blue, green);
    }
}
