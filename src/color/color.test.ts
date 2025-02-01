import assert from "assert";
import { Color, hexToColor, isHexColor } from "./color";

describe('colors', () => {

    it('is hex color', () => {
        assert.equal(isHexColor("#1AFFa1"), true);
        assert.equal(isHexColor("#1AFFa166"), true);
        assert.equal(isHexColor("#F00"), false);
        assert.equal(isHexColor("123456"), false);
        assert.equal(isHexColor("#123abce"), false);
        assert.equal(isHexColor("#afafah"), false);
    });

    it('hex to color', () => {
        assert.equal(hexToColor("123456"), undefined);
        const actual = hexToColor("#1AFFa1");
        const expected = new Color(26, 255, 161);
        assert.ok(actual !== undefined && expected.equals(actual));
        assert.equal(isHexColor("#1AFFa166"), true);
        const actualAlpha = hexToColor("#1AFFa166");
        const expectedAlpha = new Color(26, 255, 161, 102);
        assert.ok(actualAlpha !== undefined && expectedAlpha.equals(actualAlpha));
    });

    it('color to hex', () => {
        assert.equal("#1affa1", new Color(26, 255, 161).toHex());
        assert.equal("#1affa166", new Color(26, 255, 161, 102).toHex());
    });

});