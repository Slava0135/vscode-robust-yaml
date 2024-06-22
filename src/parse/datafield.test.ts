import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { DataField, parseDataFields } from "./datafield";

describe('parse datafields', () => {

    it('one datafield', () => {
        const source = readSource('one-datafield');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one inferred datafield', () => {
        const source = readSource('one-inferred-datafield');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('one datafield with options', () => {
        const source = readSource('one-datafield-options');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one datafield with options and other tags', () => {
        const source = readSource('one-datafield-other-options');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one datafield with other tags reversed', () => {
        const source = readSource('one-datafield-other-reverse');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one datafield with other tags', () => {
        const source = readSource('one-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one datafield on same line', () => {
        const source = readSource('one-datafield-same-line');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool')]);
    });

    it('one inferred datafield with other tags', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('one inferred datafield with options', () => {
        const source = readSource('one-inferred-datafield-options');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('one inferred datafield on same line', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('one inferred datafield with tags on multiple lines', () => {
        const source = readSource('one-inferred-datafield-multiline');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('one inferred datafield with get and set', () => {
        const source = readSource('one-inferred-datafield-multiline');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool')]);
    });

    it('many mixed datafields 1', () => {
        const source = readSource('many-mixed-datafields-1');
        const expected = [
            new DataField('clothingVisuals', 'Dictionary<string, List<PrototypeLayerData>>'),
            new DataField('quickEquip', 'bool'),
            new DataField('slots', 'SlotFlags'),
            new DataField('equipSound', 'SoundSpecifier?'),
            new DataField('unequipSound', 'SoundSpecifier?'),
            new DataField('equippedPrefix', 'string?'),
            new DataField('equippedState', 'string?'),
            new DataField('sprite', 'string?'),
            new DataField('maleMask', 'ClothingMask'),
            new DataField('femaleMask', 'ClothingMask'),
            new DataField('unisexMask', 'ClothingMask'),
            new DataField('equipDelay', 'TimeSpan'),
            new DataField('unequipDelay', 'TimeSpan'),
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

    it('many mixed datafields 2', () => {
        const source = readSource('many-mixed-datafields-2');
        const expected = [
            new DataField('altDisarm', 'bool'),
            new DataField('hidden', 'bool'),
            new DataField('nextAttack', 'TimeSpan'),
            new DataField('resetOnHandSelected', 'bool'),
            new DataField('attackRate', 'float'),
            new DataField('autoAttack', 'bool'),
            new DataField('damage', 'DamageSpecifier'),
            new DataField('bluntStaminaDamageFactor', 'FixedPoint2'),
            new DataField('clickDamageModifier', 'FixedPoint2'),
            new DataField('range', 'float'),
            new DataField('angle', 'Angle'),
            new DataField('animation', 'EntProtoId'),
            new DataField('wideAnimation', 'EntProtoId'),
            new DataField('wideAnimationRotation', 'Angle'),
            new DataField('swingLeft', 'bool'),
            new DataField('soundSwing', 'SoundSpecifier'),
            new DataField('soundHit', 'SoundSpecifier?'),
            new DataField('soundNoDamage', 'SoundSpecifier'),
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/datafield/${name}.cs`);
    return readFileSync(p).toString();
}