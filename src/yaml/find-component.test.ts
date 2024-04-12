import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { findComponent } from "./find-component";
import { nonZeroBasedPosition } from "../range/position";

describe('find component in yaml document', () => {

    it('one entity - one component', () => {
        let source = readSource('one-entity-one-component');
        let okComponent = findComponent(source, nonZeroBasedPosition(3, 11));
        assert.ok(okComponent);
        assert.equal(okComponent.toString(), 'test');
        let notComponent = findComponent(source, nonZeroBasedPosition(4, 11));
        assert.equal(notComponent, undefined);
    });

    it('component bounds', () => {
        let source = readSource('one-entity-one-component');
        let positions = [
            nonZeroBasedPosition(3, 10),
            nonZeroBasedPosition(3, 11),
            nonZeroBasedPosition(3, 12),
            nonZeroBasedPosition(3, 13),
            nonZeroBasedPosition(3, 14),
            nonZeroBasedPosition(3, 15)
        ];
        let expect = [
            undefined,
            'test',
            'test',
            'test',
            'test',
            undefined
        ];
        let components = positions.map(p => findComponent(source, p)?.toString());
        assert.deepStrictEqual(components, expect);
    });

    it('no entity', () => {
        let source = readSource('no-entity');
        assert.equal(findComponent(source, nonZeroBasedPosition(3, 11)), undefined);
    });

    it('one entity - many components', () => {
        let source = readSource('one-entity-many-components');
        let comp1 = findComponent(source, nonZeroBasedPosition(3, 11));
        assert.ok(comp1);
        assert.equal(comp1.toString(), 'comp1');
        let comp2 = findComponent(source, nonZeroBasedPosition(7, 11));
        assert.ok(comp2);
        assert.equal(comp2.toString(), 'comp2');
        let comp3 = findComponent(source, nonZeroBasedPosition(11, 11));
        assert.ok(comp3);
        assert.equal(comp3.toString(), 'comp3');
    });

});

function readSource(name: string): string {
    let p = path.resolve(__dirname, `./test-resources/${name}.yml`);
    return readFileSync(p).toString();
}
