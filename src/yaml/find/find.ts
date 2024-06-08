import { Scalar, YAMLMap, isCollection, isScalar, parseDocument, visit } from "yaml";
import { Position, positionFromOffset } from "../../range/position";
import { Range } from "../../range/range";

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

export function isAtComponentType(source: string, pos: Position): boolean {
    let ret = false;
    visitComponents(source, type => {
        if (type.range) {
            const start = positionFromOffset(source, type.range[0]);
            if (start && start.line === pos.line) {
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
            if (isScalar(key) && key.range) {
                const start = positionFromOffset(source, key.range[0]);
                const end = positionFromOffset(source, key.range[1]);
                if (start?.isBeforeOrEquals(pos) && end?.isAfter(pos)) {
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
