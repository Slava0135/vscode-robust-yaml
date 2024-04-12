import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { findAllComponents, findComponent, isAtComponentType } from "./find-component";
import { nonZeroBasedPosition } from "../../range/position";
import { Range } from "../../range/range";

describe('find component in yaml document', () => {

    it('one entity - one component', () => {
        const source = readSource('one-entity-one-component');
        const okComponent = findComponent(source, nonZeroBasedPosition(3, 11));
        assert.ok(okComponent);
        assert.equal(okComponent.toString(), 'test');
        const notComponent = findComponent(source, nonZeroBasedPosition(4, 11));
        assert.equal(notComponent, undefined);
    });

    it('component bounds', () => {
        const source = readSource('one-entity-one-component');
        const positions = [
            nonZeroBasedPosition(3, 10),
            nonZeroBasedPosition(3, 11),
            nonZeroBasedPosition(3, 12),
            nonZeroBasedPosition(3, 13),
            nonZeroBasedPosition(3, 14),
            nonZeroBasedPosition(3, 15)
        ];
        const expect = [
            undefined,
            'test',
            'test',
            'test',
            'test',
            undefined
        ];
        const components = positions.map(p => findComponent(source, p)?.toString());
        assert.deepStrictEqual(components, expect);
    });

    it('no entity', () => {
        const source = readSource('no-entity');
        assert.equal(findComponent(source, nonZeroBasedPosition(3, 11)), undefined);
    });

    it('one entity - many components', () => {
        const source = readSource('one-entity-many-components');
        const comp1 = findComponent(source, nonZeroBasedPosition(3, 11));
        assert.ok(comp1);
        assert.equal(comp1.toString(), 'comp1');
        const comp2 = findComponent(source, nonZeroBasedPosition(7, 11));
        assert.ok(comp2);
        assert.equal(comp2.toString(), 'comp2');
        const comp3 = findComponent(source, nonZeroBasedPosition(11, 11));
        assert.ok(comp3);
        assert.equal(comp3.toString(), 'comp3');
    });

});

describe('find all components in yaml document', () => {
    it('one entity - many components', () => {
        let source = readSource('one-entity-many-components');
        const components = findAllComponents(source).entries();
        const actual = new Map(Array.from(components, ([k, v]) => { 
            return [k.toString(), v]; 
        }));
        const expected = new Map([ 
            ['comp1', new Range(nonZeroBasedPosition(3, 11), nonZeroBasedPosition(3, 15))],
            ['comp2', new Range(nonZeroBasedPosition(7, 11), nonZeroBasedPosition(7, 15))],
            ['comp3', new Range(nonZeroBasedPosition(11, 11), nonZeroBasedPosition(11, 15))]
        ]);
        assert.deepStrictEqual(actual, expected);
    });
});

describe('is at component type', () => {
    it('one entity - one component', () => {
        let source = readSource('one-entity-one-component');
        assert.ok(isAtComponentType(source,nonZeroBasedPosition(3, 11)));
        assert.equal(isAtComponentType(source,nonZeroBasedPosition(4, 11)), false);
    });
});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/${name}.yml`);
    return readFileSync(p).toString();
}
