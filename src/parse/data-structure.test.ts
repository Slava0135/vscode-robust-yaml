import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { DataField } from "./datafield";
import { DataStructure, parseDataStructures } from "./data-structure";
import { Structure, StructureKind } from "./structure";

describe('parse data structure', () => {

    it('one component', () => {
        const source = readSource('one-component');
        const expected = [
            new DataStructure(new Structure(StructureKind.Component, 'SomeComponent', 9, 12),
                [new DataField('someField', 'SomeType', 11)]
            )
        ];
        assert.deepEqual(parseDataStructures(source), expected);
    });

    it('two components', () => {
        const source = readSource('two-components');
        const expected = [
            new DataStructure(new Structure(StructureKind.Component, 'ComponentA', 9, 12),
                [new DataField('fieldA', 'TypeA', 11)]
            ),
            new DataStructure(new Structure(StructureKind.Component, 'ComponentB', 18, 21),
                [new DataField('fieldB', 'TypeB', 20)]
            )
        ];
        assert.deepEqual(parseDataStructures(source), expected);
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/data-structure/${name}.cs`);
    return readFileSync(p).toString();
}