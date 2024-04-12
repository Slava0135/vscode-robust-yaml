import { Scalar, isCollection, isScalar, parseDocument, visit } from "yaml";
import { Position, positionFromOffset } from "../range/position";
import { Range } from "../range/range";

export function findComponent(source: string, pos: Position): Scalar | undefined {
    let component: Scalar | undefined;
    const doc = parseDocument(source);
    visit(doc, {
        Map(_, map) {
            const type = map.get('type', true);
            if (type && type.toString() !== 'entity') {
                return visit.SKIP;
            }
            const components = map.get('components');
            if (isCollection(components)) {
                visit(components, {
                    Map(_, map) {
                        const type = map.get('type', true);
                        if (isScalar(type) && type.range) {
                            const start = positionFromOffset(source, type.range[0]);
                            const end = positionFromOffset(source, type.range[2]-1);
                            if (start && end && new Range(start, end).contains(pos)) {
                                component = type;
                                return visit.BREAK;
                            }
                        }
                    }
                });
            }
            if (component) {
                return visit.BREAK;
            }
        }
    });
    return component;
}
