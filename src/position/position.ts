export class Position {

    readonly line: number;
    readonly character: number;

    constructor(line: number, character: number) {
        this.line = line;
        this.character = character;
    }

}

export function nonZeroBasedPosition(line: number, character: number): Position {
    return new Position(line, character);
}
