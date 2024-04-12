import { Scalar, isCollection, isScalar, parseDocument, visit } from "yaml";
import { Position, positionFromOffset } from "../../range/position";
import { Range } from "../../range/range";

export function findComponent(source: string, pos: Position): Scalar | undefined {
    let component: Scalar | undefined;
    visitComponents(source, type => {
        if (type.range) {
            const start = positionFromOffset(source, type.range[0]);
            const end = positionFromOffset(source, type.range[1]-1);
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
            const end = positionFromOffset(source, type.range[1]-1);
            if (start && end) {
                const range = new Range(start, end);
                res.set(type, range);
            }
        }
        return undefined;
    });
    return res;
}

function visitComponents(source: string, callback: (type: Scalar) => symbol | undefined) {
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
                            visitRes = callback(type);
                        }
                    }
                });
            }
            return visitRes;
        }
    });
}
