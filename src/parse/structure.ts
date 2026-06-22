import { WHITESPACE_CHARS } from "./constants";

export enum StructureKind {
    Component = "RegisterComponent",
}

export class Structure {
    readonly kind: StructureKind;
    readonly name: string;
    readonly firstLine: number;
    readonly lastLine: number;

    constructor(kind: StructureKind, name: string, firstLine: number, lastLine: number) {
        this.kind = kind;
        this.name = name;
        this.firstLine = firstLine;
        this.lastLine = lastLine;
    }
}

export function parseStructures(source: string): Structure[] {
    const structures: Structure[] = [];

    const lines = source.split('\n');
    let lineIndex = 0;

    search: while (lineIndex < lines.length) {
        let line = lines[lineIndex];

        let structureKind: StructureKind | undefined;
        // search for pattern: `[...ATTRIBUTE...]`
        parseStructureKind: {
            const leftAttributeListBracketIndex = line.indexOf('[');
            const rightAttributeListBracketIndex = line.lastIndexOf(']');

            if (leftAttributeListBracketIndex < 0 || rightAttributeListBracketIndex < 0 || leftAttributeListBracketIndex > rightAttributeListBracketIndex) {
                break parseStructureKind;
            }

            for (const kind of Object.values(StructureKind)) {
                const attributeIndex = line.indexOf(kind);
                if (attributeIndex > leftAttributeListBracketIndex && attributeIndex < rightAttributeListBracketIndex) {
                    // will need to parse attribute params later too 
                    structureKind = kind;
                    break;
                }
            }
        }

        if (structureKind === undefined) {
            lineIndex += 1;
            continue search;
        }

        // should end with whitespace!
        const structureKeywords = ["class ", "record ", "struct ", "interface "];
        parseStructure: {
            let keyword: string = "";
            let keywordIndex = -1;
            findDeclaration: while (lineIndex < lines.length) {
                line = lines[lineIndex];
                for (const k of structureKeywords) {
                    keyword = k;
                    keywordIndex = line.indexOf(keyword);
                    if (keywordIndex >= 0) {
                        break findDeclaration;
                    }
                }
                lineIndex += 1;
            }
            if (keywordIndex < 0) {
                // structure definition not found
                break parseStructure;
            }

            const firstLine = lineIndex;
            const structureIndent = line.length - line.trimStart().length;

            // now we need to find the structure name
            // set the index right after keyword
            let charIndex = keywordIndex + (keyword.length - 1); // ignore whitespace in the end
            if (charIndex >= line.length) {
                break parseStructure;
            }
            while (WHITESPACE_CHARS.has(line.charAt(charIndex))) {
                charIndex += 1;
                if (charIndex >= line.length) {
                    break parseStructure;
                }
            }

            const leftNameIndex = charIndex;
            while (true) {
                charIndex += 1;
                if (charIndex >= line.length) {
                    break parseStructure;
                }
                const ch = line.charAt(charIndex);
                if (WHITESPACE_CHARS.has(ch)) {
                    // found the end of name string, backtrack to last character
                    charIndex -= 1;
                    break;
                }
            }
            const rightNameIndex = charIndex;
            const name = line.substring(leftNameIndex, rightNameIndex + 1);

            // find the last line / closing bracket
            // we are not counting bracket pairs but compare indents, assuming the code is formatted
            while (true) {
                lineIndex += 1;
                line = lines[lineIndex];
                if (lineIndex >= lines.length) {
                    break parseStructure
                }
                const trimmedLine = line.trimStart();
                if (trimmedLine.length > 0 && trimmedLine[0] === '}' && (line.length - trimmedLine.length) == structureIndent) {
                    break;
                }
            }
            const lastLine = lineIndex;

            structures.push(new Structure(structureKind, name, firstLine + 1, lastLine + 1))
            // backtrack to class declaration to analyze nested structures
            lineIndex = firstLine;
        }

        lineIndex += 1
    }
    return structures
}