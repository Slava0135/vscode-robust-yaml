import { minimatch } from "minimatch";

export function containsComponentDefinition(uri: string, name: string): boolean {
    return minimatch(uri, `**/?(Shared)${name}Component.cs`);
}
