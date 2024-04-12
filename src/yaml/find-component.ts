import { Document, Scalar, isCollection, isScalar, visit } from "yaml";
import { Position } from "../range/position";

export function findComponent(doc: Document, pos: Position): Scalar | undefined {
    let component: Scalar | undefined;
    visit(doc, {
        Map(_, map) {
            let components = map.get('components');
            if (isCollection(components)) {
                return visit(components, {
                    Map(_, map) {
                        let type = map.get('type', true);
                        if (isScalar(type)) {
                            component = type;
                            return visit.BREAK;
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
