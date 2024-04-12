import assert from "assert";
import { Position } from "./position";

describe('position', () => {

    it('is before', () => {
        let pos1 = new Position(1, 2);
        let pos2 = new Position(3, 4);
        assert.ok(pos1.isBefore(pos2));
        assert.equal(pos2.isBefore(pos1), false);
        let pos3 = new Position(3, 5);
        assert.ok(pos1.isBefore(pos3));
    });

    it('is after', () => {
        let pos1 = new Position(1, 2);
        let pos2 = new Position(3, 4);
        assert.ok(pos2.isAfter(pos1));
        assert.equal(pos1.isAfter(pos2), false);
        let pos3 = new Position(3, 5);
        assert.ok(pos3.isAfter(pos1));
    });

    it('is before or equals', () => {
        let pos1 = new Position(1, 2);
        let pos2 = new Position(1, 2);
        assert.equal(pos1.isBefore(pos2), false);
        assert.ok(pos1.isBeforeOrEquals(pos2));
    });

    it('is after or equals', () => {
        let pos1 = new Position(1, 2);
        let pos2 = new Position(1, 2);
        assert.equal(pos1.isAfter(pos2), false);
        assert.ok(pos1.isAfterOrEquals(pos2));
    });

});