import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { findComponent } from "./find-component";
import { nonZeroBasedPosition } from "../range/position";

describe('find component in yaml document', () => {
    it('one entity - one component', () => {
        let source = readSource('one-entity-one-component');
        let okComponent = findComponent(source, nonZeroBasedPosition(3, 11));
        assert.ok(okComponent);
        assert.equal(okComponent.toString(), 'test');
        let notComponent = findComponent(source, nonZeroBasedPosition(4, 11));
        assert.equal(notComponent, undefined);
    });
});

function readSource(name: string): string {
    let p = path.resolve(__dirname, `./test-resources/${name}.yml`);
    return readFileSync(p).toString();
}
