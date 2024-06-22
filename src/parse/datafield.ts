export function parseDataFields(source: string): string[] {
    const dataFields: string[] = [];
    const lines = source.split('\n');
    const inferredDataFieldPattern = new RegExp(/.*\[(.+,\s*)*DataField(\((.*)(,.*)*\))?(\s*,.+)*\].*/);
    const dataFieldPattern = new RegExp(/.*\[(.+,\s*)*DataField(\("(.*)"(,.*)*\))(\s*,.+)*\].*/);
    const fieldPattern = new RegExp(/\s*(public|internal|private|protected|readonly)[^;={]*\s+([A-Za-z0-9_-]+)\s*(=|;|\{).*/);
    let i = 0;
    while (i < lines.length) {
        let match = lines[i].match(dataFieldPattern);
        if (match) {
            let name = match[3];
            dataFields.push(name);
        } else {
            match = lines[i].match(inferredDataFieldPattern);
            if (match) {
                i++;
                while (i < lines.length) {
                    let match = lines[i].match(fieldPattern);
                    if (match) {
                        let name = match[2];
                        dataFields.push(name[0].toLowerCase() + name.substring(1));
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
