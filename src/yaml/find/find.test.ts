import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { findAllColors, findAllComponents, findAllFields, findAllPaths, findComponent, findComponentByField, findField, findPath, isAtComponentField, isAtComponentType } from "./find";
import { nonZeroBasedPosition } from "../../range/position";
import { Range } from "../../range/range";
import { Color } from "../../color/color";

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
        assert.deepEqual(actual, expected);
    });
});

describe('find all fields in yaml document', () => {
    it('one entity - many components', () => {
        let source = readSource('one-entity-many-components');
        const components = findAllFields(source).entries();
        const actual = new Map(Array.from(components, ([k, v]) => {
            return [k.toString(), v];
        }));
        const expected = new Map([
            ['key1', new Range(nonZeroBasedPosition(4, 5), nonZeroBasedPosition(4, 9))],
            ['key2', new Range(nonZeroBasedPosition(5, 5), nonZeroBasedPosition(5, 9))],
            ['key3', new Range(nonZeroBasedPosition(6, 5), nonZeroBasedPosition(6, 9))],
            ['key1', new Range(nonZeroBasedPosition(8, 5), nonZeroBasedPosition(8, 9))],
            ['key2', new Range(nonZeroBasedPosition(9, 5), nonZeroBasedPosition(9, 9))],
            ['key3', new Range(nonZeroBasedPosition(10, 5), nonZeroBasedPosition(10, 9))],
            ['key1', new Range(nonZeroBasedPosition(12, 5), nonZeroBasedPosition(12, 9))],
            ['key2', new Range(nonZeroBasedPosition(13, 5), nonZeroBasedPosition(13, 9))],
            ['key3', new Range(nonZeroBasedPosition(14, 5), nonZeroBasedPosition(14, 9))]
        ]);
        assert.deepEqual(actual, expected);
    });
});

describe('is at component type', () => {
    it('one entity - one component', () => {
        let source = readSource('one-entity-one-component');
        assert.ok(isAtComponentType(source, nonZeroBasedPosition(3, 11)));
        assert.ok(isAtComponentType(source, nonZeroBasedPosition(3, 15)));
        assert.equal(isAtComponentType(source, nonZeroBasedPosition(3, 10)), false);
        assert.equal(isAtComponentType(source, nonZeroBasedPosition(3, 16)), false);
        assert.equal(isAtComponentType(source, nonZeroBasedPosition(4, 11)), false);
    });
});

describe('is at component field', () => {
    it('one entity - one component', () => {
        let source = readSource('one-entity-one-component');
        assert.ok(isAtComponentField(source, nonZeroBasedPosition(4, 5)));
        assert.ok(isAtComponentField(source, nonZeroBasedPosition(4, 9)));
        assert.equal(isAtComponentField(source, nonZeroBasedPosition(3, 6)), false);
        assert.equal(isAtComponentField(source, nonZeroBasedPosition(4, 4)), false);
        assert.equal(isAtComponentField(source, nonZeroBasedPosition(4, 10)), false);
        assert.equal(isAtComponentField(source, nonZeroBasedPosition(5, 11)), false);
    });
});

describe('find component by field', () => {
    it('one entity - many components', () => {
        let source = readSource('one-entity-many-components');
        assert.equal(findComponentByField(source, nonZeroBasedPosition(4, 7)), 'comp1');
        assert.equal(findComponentByField(source, nonZeroBasedPosition(9, 7)), 'comp2');
        assert.equal(findComponentByField(source, nonZeroBasedPosition(14, 7)), 'comp3');
        assert.equal(findComponentByField(source, nonZeroBasedPosition(2, 7)), undefined);
    });
});

describe('find field', () => {
    it('one entity - many components', () => {
        let source = readSource('one-entity-many-components');
        assert.equal(findField(source, nonZeroBasedPosition(5, 7)), 'key2');
        assert.equal(findField(source, nonZeroBasedPosition(7, 7)), undefined);
    });
});

describe('find all paths', () => {
    it('one path', () => {
        let source = readSource('one-path');
        const paths = findAllPaths(source).entries();
        const actual = new Map(Array.from(paths, ([k, v]) => {
            return [k.toString(), v];
        }));
        const expected = new Map([
            ['path/to/file.txt', new Range(nonZeroBasedPosition(5, 11), nonZeroBasedPosition(5, 26))],
        ]);
        assert.deepEqual(actual, expected);
    });
});

describe('find all colors', () => {
    it('one color', () => {
        let source = readSource('one-color');
        const actual = findAllColors(source);
        const expected: [color: Color, range: Range][] = [];
        expected.push([new Color(26, 255, 161), new Range(nonZeroBasedPosition(5, 11), nonZeroBasedPosition(5, 19))]);
        assert.deepEqual(expected, actual);
    });
});

describe('find path', () => {
    it('one path', () => {
        let source = readSource('one-path');
        assert.equal(findPath(source, nonZeroBasedPosition(5, 22)), "path/to/file.txt");
        assert.equal(findPath(source, nonZeroBasedPosition(6, 22)), undefined);
    });
});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/${name}.yml`);
    return readFileSync(p).toString();
}
