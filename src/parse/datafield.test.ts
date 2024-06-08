import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseDataFields } from "./datafield";

describe('parse datafields', () => {

    it('one datafield', () => {
        const source = readSource('one-datafield');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/datafield/${name}.cs`);
    return readFileSync(p).toString();
}