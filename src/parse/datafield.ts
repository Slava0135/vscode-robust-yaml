export class DataField {
    readonly name: string;
    readonly type: string | undefined;
    readonly line: number;

    constructor(name: string, type: string, line: number) {
        this.name = name;
        if (!type.includes(">") && !type.includes("<")) {
            this.type = type;
        }
        this.line = line;
    }
}

export function parseDataFields(source: string): DataField[] {
    const dataFields: DataField[] = [];
    const lines = source.split('\n');
    const inferredDataFieldPattern = new RegExp(/.*\[(.+,\s*)*DataField(\((.*)(,.*)*\))?(\s*,.+)*\].*/);
    const dataFieldPattern = new RegExp(/.*\[(.+,\s*)*DataField(\("(.*)"(,.*)*\))(\s*,.+)*\].*/);
    const fieldPattern = new RegExp(/.*(public|internal|private|protected|readonly)[^;={]*\s+([^;={]+)\s+([A-Za-z0-9_-]+)\s*(=|;|\{).*/);
    let i = 0;
    while (i < lines.length) {
        let match = lines[i].match(dataFieldPattern);
        if (match) {
            let name = match[3];
            while (i < lines.length) {
                let match = lines[i].match(fieldPattern);
                if (match) {
                    dataFields.push(new DataField(name[0].toLowerCase() + name.substring(1), match[2], i+1));
                    break;
                }
                i++;
            }
        } else {
            match = lines[i].match(inferredDataFieldPattern);
            if (match) {
                while (i < lines.length) {
                    let match = lines[i].match(fieldPattern);
                    if (match) {
                        let name = match[3];
                        dataFields.push(new DataField(name[0].toLowerCase() + name.substring(1), match[2], i+1));
                        break;
                    }
                    i++;
                }
            }
        }
        i++;
    }
    return dataFields;
}
