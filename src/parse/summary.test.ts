import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseComponentSummary, parseDatafieldSummary } from "./summary";

describe('parse component summary', () => {

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

    it('multiline component', () => {
        const source = readSource('multiline-component');
        assert.equal(
            parseComponentSummary(source, 'MeleeWeapon'),
            "When given to a mob lets them do unarmed attacks\nor when given to an item lets someone wield it to do attacks."
        );
    });

});

describe('parse datafield summary', () => {

    it('one component', () => {
        const source = readSource('one-datafield');
        assert.equal(
            parseDatafieldSummary(source, 'handle'),
            "Whether or not to mark an interaction as handled after playing the sound. Useful if this component is\nused to play sound for some other component with on-use functionality"
        );
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/summary/${name}.cs`);
    return readFileSync(p).toString();
}

