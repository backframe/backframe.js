"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceAst = exports.visitAst = void 0;
const nestedNodeMap = {
    schema: ["declarations"],
    model: ["name", "members"],
    type: ["name", "members"],
    enum: ["name", "members"],
    datasource: ["name", "members"],
    generator: ["name", "members"],
    field: ["name", "type", "attributes", "comment"],
    typeId: ["name"],
    list: ["type"],
    optional: ["type"],
    required: ["type"],
    unsupported: ["type"],
    enumValue: ["name", "attributes", "comment"],
    typeAlias: ["name", "type", "attributes"],
    config: ["name", "value", "comment"],
    blockAttribute: ["path", "args", "comment"],
    fieldAttribute: ["path", "args"],
    namedArgument: ["name", "expression"],
    name: ["value"],
    literal: ["value"],
    path: ["value"],
    array: ["items"],
    functionCall: ["path", "args"],
    commentBlock: ["comments"],
    comment: ["text"],
    docComment: ["text"],
};
function isPrismaAstNode(v) {
    return isRecord(v) && typeof v.kind === "string" && v.kind in nestedNodeMap;
}
function isRecord(v) {
    return typeof v === "object" && v != null;
}
function visitAst(node, visitor) {
    const nv = visitor[node.kind];
    nv?.enter?.(node);
    const keys = nestedNodeMap[node.kind];
    for (const key of keys) {
        const value = node[key];
        if (Array.isArray(value) && value.every(isPrismaAstNode)) {
            for (const member of value) {
                visitAst(member, visitor);
            }
        }
        else if (isPrismaAstNode(value)) {
            visitAst(value, visitor);
        }
    }
    nv?.leave?.(node);
}
exports.visitAst = visitAst;
function reduceAst(node, reducer) {
    const keys = nestedNodeMap[node.kind];
    const reducedNode = keys.reduce((rn, key) => {
        rn[key] = reduceField(node, key, reducer);
        return rn;
    }, {});
    const nr = reducer[node.kind];
    return nr?.(reducedNode);
}
exports.reduceAst = reduceAst;
function reduceField(node, key, reducer) {
    const value = node[key];
    if (Array.isArray(value) && value.every(isPrismaAstNode)) {
        return value.reduce((arr, elem) => {
            const reduced = reduceAst(elem, reducer);
            if (reduced != null) {
                arr.push(reduced);
            }
            return arr;
        }, []);
    }
    if (isPrismaAstNode(value)) {
        return reduceAst(value, reducer);
    }
    return value;
}
//# sourceMappingURL=visit.js.map