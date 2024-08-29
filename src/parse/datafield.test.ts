import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { DataField, parseDataFields } from "./datafield";

describe('parse datafields', () => {

    it('one datafield', () => {
        const source = readSource('one-datafield');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 21)]);
    });

    it('one inferred datafield', () => {
        const source = readSource('one-inferred-datafield');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 17)]);
    });

    it('one datafield with options', () => {
        const source = readSource('one-datafield-options');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 21)]);
    });

    it('one datafield with options and other tags', () => {
        const source = readSource('one-datafield-other-options');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 21)]);
    });

    it('one datafield with other tags reversed', () => {
        const source = readSource('one-datafield-other-reverse');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 21)]);
    });

    it('one datafield with other tags', () => {
        const source = readSource('one-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 21)]);
    });

    it('one datafield on same line', () => {
        const source = readSource('one-datafield-same-line');
        assert.deepEqual(parseDataFields(source), [new DataField('handle', 'bool', 20)]);
    });

    it('one inferred datafield with other tags', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 17)]);
    });

    it('one inferred datafield with options', () => {
        const source = readSource('one-inferred-datafield-options');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 17)]);
    });

    it('one inferred datafield on same line', () => {
        const source = readSource('one-inferred-datafield-other');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 17)]);
    });

    it('one inferred datafield with tags on multiple lines', () => {
        const source = readSource('one-inferred-datafield-multiline');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 19)]);
    });

    it('one inferred datafield with get and set', () => {
        const source = readSource('one-inferred-datafield-get-set');
        assert.deepEqual(parseDataFields(source), [new DataField('altDisarm', 'bool', 17)]);
    });

    it('many mixed datafields 1', () => {
        const source = readSource('many-mixed-datafields-1');
        const expected = [
            new DataField('clothingVisuals', 'Dictionary<string, List<PrototypeLayerData>>', 20),
            new DataField('quickEquip', 'bool', 24),
            new DataField('slots', 'SlotFlags', 29),
            new DataField('equipSound', 'SoundSpecifier?', 33),
            new DataField('unequipSound', 'SoundSpecifier?', 37),
            new DataField('equippedPrefix', 'string?', 42),
            new DataField('equippedState', 'string?', 51),
            new DataField('sprite', 'string?', 55),
            new DataField('maleMask', 'ClothingMask', 59),
            new DataField('femaleMask', 'ClothingMask', 63),
            new DataField('unisexMask', 'ClothingMask', 67),
            new DataField('equipDelay', 'TimeSpan', 72),
            new DataField('unequipDelay', 'TimeSpan', 75),
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

    it('many mixed datafields 2', () => {
        const source = readSource('many-mixed-datafields-2');
        const expected = [
            new DataField('altDisarm', 'bool', 22),
            new DataField('hidden', 'bool', 29),
            new DataField('nextAttack', 'TimeSpan', 37),
            new DataField('resetOnHandSelected', 'bool', 43),
            new DataField('attackRate', 'float', 55),
            new DataField('autoAttack', 'bool', 68),
            new DataField('damage', 'DamageSpecifier', 75),
            new DataField('bluntStaminaDamageFactor', 'FixedPoint2', 79),
            new DataField('clickDamageModifier', 'FixedPoint2', 85),
            new DataField('range', 'float', 92),
            new DataField('angle', 'Angle', 98),
            new DataField('animation', 'EntProtoId', 101),
            new DataField('wideAnimation', 'EntProtoId', 104),
            new DataField('wideAnimationRotation', 'Angle', 111),
            new DataField('swingLeft', 'bool', 114),
            new DataField('soundSwing', 'SoundSpecifier', 124),
            new DataField('soundHit', 'SoundSpecifier?', 135),
            new DataField('soundNoDamage', 'SoundSpecifier', 142),
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

    it('many datafields on same line', () => {
        const source = readSource('many-datafields-same-line');
        const expected = [
            new DataField('FieldA', 'SomeType', 12),
            new DataField('FieldB', 'SomeType', 12),
            new DataField('FieldC', 'SomeType', 12),
        ];
        assert.deepEqual(parseDataFields(source), expected);
    });

});

function readSource(name: string): string {
    const p = path.resolve(__dirname, `./test-resources/datafield/${name}.cs`);
    return readFileSync(p).toString();
}