import assert from "assert";
import { readFileSync } from "fs";
import path from "path";
import { parseStructures, Structure, StructureKind } from "./structure";

describe('parse structure', () => {

  it('one component', () => {
    const source = readSource('one-component');
    assert.deepEqual(parseStructures(source), [new Structure(StructureKind.Component, "SomeComponent", 9, 12)]);
  });

  it('two components', () => {
    const source = readSource('two-components');
    assert.deepEqual(parseStructures(source), [
      new Structure(StructureKind.Component, "ComponentA", 9, 12),
      new Structure(StructureKind.Component, "ComponentB", 18, 21)
    ]);
  });

  it('no components', () => {
    const source = readSource('no-components');
    assert.deepEqual(parseStructures(source), []);
  });

  it('nested components', () => {
    const source = readSource('nested-components');
    assert.deepEqual(parseStructures(source), [
      new Structure(StructureKind.Component, "ComponentA", 9, 21),
      new Structure(StructureKind.Component, "ComponentB", 17, 20)
    ]);
  });

});

function readSource(name: string): string {
  const p = path.resolve(__dirname, `./test-resources/structure/${name}.cs`);
  return readFileSync(p).toString();
}
