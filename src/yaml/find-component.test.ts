import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { Document, parseDocument } from "yaml";
import { findComponent } from "./find-component";
import { nonZeroBasedPosition } from "../range/position";

describe('find component in yaml document', () => {
    it('one entity - one component', () => {
        let doc = readYamlFile('one-entity-one-component');
        let okComponent = findComponent(doc, nonZeroBasedPosition(3, 11));
        assert.ok(okComponent);
        assert.equal(okComponent.toString(), 'test');
        let notComponent = findComponent(doc, nonZeroBasedPosition(4, 11));
        assert.equal(notComponent, undefined);
    });
});

function readYamlFile(name: string): Document {
    let p = path.resolve(__dirname, `./test-resources/${name}.yml`);
    let contents = readFileSync(p).toString();
    return parseDocument(contents);
}
