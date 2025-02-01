import assert from "assert";
import { Color, hexToColor, isHexColor } from "./color";

describe('colors', () => {

    it('is hex color', () => {
        assert.equal(isHexColor("#1AFFa1"), true);
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
    });

});