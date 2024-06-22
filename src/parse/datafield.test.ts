import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseDataFields } from "./datafield";

describe('parse datafields', () => {

    it('one datafield', () => {
        const source = readSource('one-datafield');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one inferred datafield', () => {
        const source = readSource('one-inferred-datafield');
        assert.deepEqual(parseDataFields(source), ['altDisarm']);
    });

    it('one datafield with options', () => {
        const source = readSource('one-datafield-options');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one datafield with options and other tags', () => {
        const source = readSource('one-datafield-other-options');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one datafield with other tags reversed', () => {
        const source = readSource('one-datafield-other-reverse');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one datafield with other tags', () => {
        const source = readSource('one-datafield-other');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one datafield on same line', () => {
        const source = readSource('one-datafield-same-line');
        assert.deepEqual(parseDataFields(source), ['handle']);
    });

    it('one inferred datafield with other tags', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), ['altDisarm']);
    });

    it('one inferred datafield on same line', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), ['altDisarm']);
    });

    it('many mixed datafields 1', () => {
        const source = readSource('many-mixed-datafields-1');
        const expected = [
            'clothingVisuals',
            'quickEquip',
            'slots',
            'equipSound',
            'unequipSound',
            'equippedPrefix',
            'equippedState',
            'sprite',
            'maleMask',
            'femaleMask',
            'unisexMask',
            'equipDelay',
            'unequipDelay',
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

    it('many mixed datafields 2', () => {
        const source = readSource('many-mixed-datafields-2');
        const expected = [
            'altDisarm',
            'hidden',
            // 'nextAttack',
            'resetOnHandSelected',
            'attackRate',
            'autoAttack',
            // 'damage',
            'bluntStaminaDamageFactor',
            'clickDamageModifier',
            'range',
            'angle',
            'animation',
            'wideAnimation',
            'wideAnimationRotation',
            'swingLeft',
            'soundSwing',
            'soundHit',
            'soundNoDamage',
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/datafield/${name}.cs`);
    return readFileSync(p).toString();
}