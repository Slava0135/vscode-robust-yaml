import assert from "assert";
import { containsComponentDefinition } from "./uri";

describe('uri', () => {
    it('contains component definition', () => {
        assert.ok(containsComponentDefinition('/path/to/a/SomeTestComponent.cs', 'SomeTest'));
        assert.ok(containsComponentDefinition('/path/to/a/SharedSomeTestComponent.cs', 'SomeTest'));
        assert.equal(containsComponentDefinition('/path/to/a/SomeTest/OtherComponent.cs', 'SomeTest'), false);
    });
});