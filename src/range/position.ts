export class Position {

    readonly line: number;
    readonly character: number;

    constructor(line: number, character: number) {
        this.line = line;
        this.character = character;
    }

    public equals(other: Position): boolean {
        return this.line === other.line && this.character === other.character;
    }

    public isBefore(other: Position): boolean {
        if (this.line < other.line) {
            return true;
        }
        if (this.line === other.line) {
            return this.character < other.character;
        }
        return false;
    }

    public isBeforeOrEquals(other: Position): boolean {
        return this.equals(other) || this.isBefore(other);
    }

    public isAfter(other: Position): boolean {
        return other.isBefore(this);
    }

    public isAfterOrEquals(other: Position): boolean {
        return this.equals(other) || this.isAfter(other);
    }

}

export function nonZeroBasedPosition(line: number, character: number): Position {
    return new Position(line-1, character-1);
}

export function positionFromOffset(source: string, offset: number): Position | undefined {
    let currentOffset = 0;
    const lines = source.split('\n');
    for (let lineN = 0; lineN < lines.length; lineN++) {
        const line = lines[lineN];
        const chars = line.length + 1;
        if (currentOffset + chars >= offset) {
            return new Position(lineN, offset - currentOffset);
        }
        currentOffset += chars;
    }
    return;
}
