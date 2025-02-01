import { Scalar, YAMLMap, isCollection, isScalar, parseDocument, visit } from "yaml";
import { Position, positionFromOffset } from "../../range/position";
import { Range } from "../../range/range";
import { Color, hexToColor, isHexColor } from "../../color/color";

export function findComponent(source: string, pos: Position): Scalar | undefined {
    let component: Scalar | undefined;
    visitComponents(source, type => {
        if (type.range) {
            const start = positionFromOffset(source, type.range[0]);
            const end = positionFromOffset(source, type.range[1] - 1);
            if (start && end && new Range(start, end).contains(pos)) {
                component = type;
                return visit.BREAK;
            }
        }
    });
    return component;
}

export function findAllComponents(source: string): Map<Scalar, Range> {
    const res = new Map<Scalar, Range>;
    visitComponents(source, type => {
        if (type.range) {
            const start = positionFromOffset(source, type.range[0]);
            const end = positionFromOffset(source, type.range[1] - 1);
            if (start && end) {
                const range = new Range(start, end);
                res.set(type, range);
            }
        }
        return undefined;
    });
    return res;
}

export function findAllFields(source: string): Map<Scalar, Range> {
    const res = new Map<Scalar, Range>;
    visitComponents(source, (_type, map) => {
        map.items.forEach(it => {
            let key = it.key;
            if (isScalar(key) && key.range && key.toString() !== 'type') {
                const start = positionFromOffset(source, key.range[0]);
                const end = positionFromOffset(source, key.range[1]);
                if (start && end) {
                    const range = new Range(start, end);
                    res.set(key, range);
                }
            }
        });
        return undefined;
    });
    return res;
}

export function isAtComponentType(source: string, pos: Position): boolean {
    let ret = false;
    visitComponents(source, type => {
        if (type.range) {
            const start = positionFromOffset(source, type.range[0]);
            const end = positionFromOffset(source, type.range[1]);
            if (start?.isBeforeOrEquals(pos) && end?.isAfterOrEquals(pos)) {
                ret = true;
                return visit.BREAK;
            }
        }
    });
    return ret;
}

export function isAtComponentField(source: string, pos: Position): boolean {
    if (isAtComponentType(source, pos)) {
        return false;
    }
    let ret = false;
    visitComponents(source, (_type, map) => {
        map.items.forEach(it => {
            let key = it.key;
            if (isScalar(key) && key.range && key.toString() !== 'type') {
                const start = positionFromOffset(source, key.range[0]);
                const end = positionFromOffset(source, key.range[1]);
                if (start?.isBeforeOrEquals(pos) && end?.isAfterOrEquals(pos)) {
                    ret = true;
                }
            }
        });
        if (ret) {
            return visit.BREAK;
        }
    });
    return ret;
}

export function findComponentByField(source: string, pos: Position): string | undefined {
    let ret: string | undefined;
    visitComponents(source, (type, map) => {
        if (map.range) {
            const start = positionFromOffset(source, map.range[0]);
            const end = positionFromOffset(source, map.range[1]);
            if (start && end && new Range(start, end).contains(pos)) {
                ret = type.toString();
                return visit.BREAK;
            }
        }
    });
    return ret;
}

export function findField(source: string, pos: Position): string | undefined {
    let ret: string | undefined;
    visitComponents(source, (_type, map) => {
        map.items.forEach(it => {
            let key = it.key;
            if (isScalar(key) && key.range && key.toString() !== 'type') {
                const start = positionFromOffset(source, key.range[0]);
                const end = positionFromOffset(source, key.range[1]);
                if (start?.isBeforeOrEquals(pos) && end?.isAfterOrEquals(pos)) {
                    ret = key.toString();
                }
            }
        });
        if (ret) {
            return visit.BREAK;
        }
    });
    return ret;
}

export function findAllPaths(source: string): Map<Scalar, Range> {
    const res = new Map<Scalar, Range>;
    const doc = parseDocument(source);
    visit(doc, {
        Scalar(_key, node) {
            if (node.range && (typeof node.value === 'string')) {
                let content = node.value as string;
                if (content.includes('/') && !content.includes(' ')) {
                    const start = positionFromOffset(source, node.range[0]);
                    const end = positionFromOffset(source, node.range[1] - 1);
                    if (start && end) {
                        const range = new Range(start, end);
                        res.set(node, range);
                    }
                }
            }
        }
    });
    return res;
}

export function findPath(source: string, pos: Position): string | undefined {
    let res: string | undefined;
    const doc = parseDocument(source);
    visit(doc, {
        Scalar(_key, node) {
            if (node.range && (typeof node.value === 'string')) {
                let content = node.value as string;
                if (content.includes('/') && !content.includes(' ')) {
                    const start = positionFromOffset(source, node.range[0]);
                    const end = positionFromOffset(source, node.range[1] - 1);
                    if (start?.isBeforeOrEquals(pos) && end?.isAfterOrEquals(pos)) {
                        res = content;
                        return visit.BREAK;
                    }
                }
            }
        }
    });
    return res;
}

export function findAllColors(source: string): [color: Color, range: Range][] {
    const res: [color: Color, range: Range][] = [];
    const doc = parseDocument(source);
    visit(doc, {
        Scalar(_key, node) {
            if (node.range && (typeof node.value === 'string')) {
                let content = node.value as string;
                if (isHexColor(content)) {
                    const start = positionFromOffset(source, node.range[0]);
                    const end = positionFromOffset(source, node.range[1] - 1);
                    const color = hexToColor(content);
                    if (color && start && end) {
                        const range = new Range(start, end);
                        res.push([color, range]);
                    }
                }
            }
        }
    });
    return res;
}

function visitComponents(source: string, callback: (type: Scalar, fields: YAMLMap) => symbol | undefined) {
    const doc = parseDocument(source);
    visit(doc, {
        Map(_, map) {
            const type = map.get('type', true);
            if (type && type.toString() !== 'entity') {
                return visit.SKIP;
            }
            const components = map.get('components');
            let visitRes;
            if (isCollection(components)) {
                visit(components, {
                    Map(_, map) {
                        const type = map.get('type', true);
                        if (isScalar(type)) {
                            visitRes = callback(type, map);
                        }
                    }
                });
            }
            return visitRes;
        }
    });
}
