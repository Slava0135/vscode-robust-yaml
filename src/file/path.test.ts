import assert from "assert";
import { containsComponentDefinition } from "./path";

describe('path', () => {
    it('contains component definition', () => {
        assert.ok(containsComponentDefinition('/path/to/a/SomeTestComponent.cs', 'SomeTest'));
        assert.ok(containsComponentDefinition('/path/to/a/SharedSomeTestComponent.cs', 'SomeTest'));
        assert.equal(containsComponentDefinition('/path/to/a/SomeTest/OtherComponent.cs', 'SomeTest'), false);
    });
});