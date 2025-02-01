import assert from "assert";
import { isHexColor } from "./color";

describe('colors', () => {

    it('is hex color', () => {
        assert.equal(isHexColor("#1AFFa1"), true);
        assert.equal(isHexColor("#F00"), false);
        assert.equal(isHexColor("123456"), false);
        assert.equal(isHexColor("#123abce"), false);
        assert.equal(isHexColor("#afafah"), false);
    });

});