import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseComponentSummary } from "./summary";

describe('parse summary', () => {

    it('one component', () => {
        const source = readSource('one-component');
        assert.equal(
            parseComponentSummary(source, 'MeleeWeapon'),
            "When given to a mob lets them do unarmed attacks, or when given to an item lets someone wield it to do attacks."
        );
        assert.equal(parseComponentSummary(source, 'Unknown'), undefined);
    });

    it('many components', () => {
        const source = readSource('many-components');
        assert.equal(
            parseComponentSummary(source, 'MeleeWeapon'),
            "When given to a mob lets them do unarmed attacks, or when given to an item lets someone wield it to do attacks."
        );
    });

    it('multiline', () => {
        const source = readSource('multiline');
        assert.equal(
            parseComponentSummary(source, 'MeleeWeapon'),
            "When given to a mob lets them do unarmed attacks\nor when given to an item lets someone wield it to do attacks."
        );
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/summary/${name}.cs`);
    return readFileSync(p).toString();
}

