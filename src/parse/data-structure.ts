import { DataField, parseDataFields } from "./datafield";
import { parseStructures, Structure } from "./structure";

export class DataStructure {
    readonly structure: Structure;
    readonly datafields: DataField[];

    constructor(structure: Structure, datafields: DataField[]) {
        this.structure = structure;
        this.datafields = datafields;
    }
}

export function parseDataStructures(source: string): DataStructure[] {
    const dataStructures: DataStructure[] = [];

    const structures = parseStructures(source);
    const datafields = parseDataFields(source);

    const datafieldToStructure: Map<DataField, Structure> = new Map();

    for (let di = 0; di < datafields.length; di++) {
        const datafield = datafields[di];
        for (let si = 0; si < structures.length; si++) {
            const structure = structures[si];
            if (structure.firstLine <= datafield.line && datafield.line <= structure.lastLine) {
                const otherStructure = datafieldToStructure.get(datafield);
                if (otherStructure !== undefined && otherStructure.lineCount() < structure.lineCount()) {
                    // structures with larger scope loses
                    continue;
                }
                datafieldToStructure.set(datafield, structure);
            }
        }
    }

    const structureToDatafields: Map<Structure, DataField[]> = new Map();
    for (const [datafield, structure] of datafieldToStructure) {
        if (!structureToDatafields.has(structure)) {
            structureToDatafields.set(structure, []);
        }
        structureToDatafields.get(structure)?.push(datafield);
    }

    for (const [structure, datafields] of structureToDatafields) {
        dataStructures.push(new DataStructure(structure, datafields))
    }

    return dataStructures;
}
