import { Position } from "./position";

export class Range {

    readonly start: Position;
    readonly end: Position;

    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
    }

    public contains(pos: Position) {
        return this.start.isBeforeOrEquals(pos) && this.end.isAfterOrEquals(pos);
    }

}