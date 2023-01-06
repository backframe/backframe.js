"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOptional = exports.findMapBlockAttribute = exports.findMapFieldAttribute = exports.readReferentialActionArgument = exports.findRelationFieldAttribute = exports.asReferentialAction = exports.isReferentialAction = exports.readOpsArgument = exports.findIndexBlockAttributes = exports.findUniqueBlockAttributes = exports.findUniqueFieldAttribute = exports.findDefaultFieldAttribute = exports.findIdBlockAttribute = exports.findIdFieldAttribute = exports.asSortOrder = exports.isSortOrder = void 0;
const catch_unknown_1 = require("catch-unknown");
require("error-cause/auto");
const access_1 = require("./access");
const format_1 = require("./format");
function isSortOrder(v) {
    return v === "Asc" || v === "Desc";
}
exports.isSortOrder = isSortOrder;
function asSortOrder(s) {
    if (!isSortOrder(s)) {
        throw new Error(`Invalid sort order: ${s}`);
    }
    return s;
}
exports.asSortOrder = asSortOrder;
function findIdFieldAttribute(decl) {
    return parseUniqueAttributeWith(decl, "id", parseIdFieldAttribute);
}
exports.findIdFieldAttribute = findIdFieldAttribute;
function parseIdFieldAttribute(attr) {
    return {
        map: applyOptional((0, access_1.findArgument)(attr.args, "map"), access_1.readStringArgument),
        length: applyOptional((0, access_1.findArgument)(attr.args, "length"), access_1.readNumberArgument),
        sort: applyOptional(applyOptional((0, access_1.findArgument)(attr.args, "sort"), access_1.readFieldReferenceArgument), asSortOrder),
        clustered: applyOptional((0, access_1.findArgument)(attr.args, "clustered"), access_1.readBooleanArgument),
    };
}
function readFieldArgument(arg) {
    const expr = (0, access_1.getArgumentExpression)(arg);
    if (expr.kind === "path") {
        return { name: (0, format_1.joinPath)(expr.value) };
    }
    if (expr.kind === "functionCall") {
        return {
            name: (0, format_1.joinPath)(expr.path.value),
            length: applyOptional((0, access_1.findArgument)(expr.args, "length"), access_1.readNumberArgument),
            sort: applyOptional(applyOptional((0, access_1.findArgument)(expr.args, "sort"), access_1.readFieldReferenceArgument), asSortOrder),
            ops: applyOptional((0, access_1.findArgument)(expr.args, "ops"), readOpsArgument),
        };
    }
    throw (0, access_1.getArgumentTypeError)(arg, "Field reference or function call");
}
function readFieldsArgument(arg) {
    const expr = (0, access_1.getArgumentExpression)(arg);
    if (expr.kind === "array") {
        return expr.items.map(readFieldArgument);
    }
    return [readFieldArgument(arg)];
}
function findIdBlockAttribute(decl) {
    return parseUniqueAttributeWith(decl, "id", parseIdBlockAttribute);
}
exports.findIdBlockAttribute = findIdBlockAttribute;
function parseIdBlockAttribute(attr) {
    return {
        fields: readFieldsArgument((0, access_1.getArgument)(attr.args, "fields", 0)),
        name: applyOptional((0, access_1.findArgument)(attr.args, "name"), access_1.readStringArgument),
        map: applyOptional((0, access_1.findArgument)(attr.args, "map"), access_1.readStringArgument),
        clustered: applyOptional((0, access_1.findArgument)(attr.args, "clustered"), access_1.readBooleanArgument),
    };
}
function findDefaultFieldAttribute(decl) {
    return parseUniqueAttributeWith(decl, "default", (attr) => ({
        expression: (0, access_1.getArgument)(attr.args, "expression", 0).expression,
        map: applyOptional((0, access_1.findArgument)(attr.args, "map"), access_1.readStringArgument),
    }));
}
exports.findDefaultFieldAttribute = findDefaultFieldAttribute;
function findUniqueFieldAttribute(decl) {
    return parseUniqueAttributeWith(decl, "unique", parseIdFieldAttribute);
}
exports.findUniqueFieldAttribute = findUniqueFieldAttribute;
function findUniqueBlockAttributes(decl) {
    return parseAttributesWith(decl, "unique", parseIdBlockAttribute);
}
exports.findUniqueBlockAttributes = findUniqueBlockAttributes;
function findIndexBlockAttributes(decl) {
    return parseAttributesWith(decl, "index", (attr) => ({
        ...parseIdBlockAttribute(attr),
        type: applyOptional((0, access_1.findArgument)(attr.args, "type"), access_1.readFieldReferenceArgument),
    }));
}
exports.findIndexBlockAttributes = findIndexBlockAttributes;
function readOpsArgument(arg) {
    const expr = (0, access_1.getArgumentExpression)(arg);
    if (expr.kind === "path") {
        return (0, format_1.joinPath)(expr.value);
    }
    if (expr.kind === "functionCall") {
        return (0, format_1.formatAst)(expr);
    }
    throw (0, access_1.getArgumentTypeError)(arg, "Identifier or function call");
}
exports.readOpsArgument = readOpsArgument;
const referentialActions = [
    "Cascade",
    "Restrict",
    "NoAction",
    "SetNull",
    "SetDefault",
];
function isReferentialAction(v) {
    return referentialActions.some((a) => a === v);
}
exports.isReferentialAction = isReferentialAction;
function asReferentialAction(s) {
    if (!isReferentialAction(s)) {
        throw new Error(`Invalid referential action: ${s}`);
    }
    return s;
}
exports.asReferentialAction = asReferentialAction;
function findRelationFieldAttribute(decl) {
    return parseUniqueAttributeWith(decl, "relation", (attr) => ({
        name: applyOptional((0, access_1.findArgument)(attr.args, "name", 0), access_1.readStringArgument),
        fields: applyOptional((0, access_1.findArgument)(attr.args, "fields"), access_1.readFieldReferencesArgument),
        references: applyOptional((0, access_1.findArgument)(attr.args, "references"), access_1.readFieldReferencesArgument),
        onDelete: applyOptional((0, access_1.findArgument)(attr.args, "onDelete"), readReferentialActionArgument),
        onUpdate: applyOptional((0, access_1.findArgument)(attr.args, "onUpdate"), readReferentialActionArgument),
    }));
}
exports.findRelationFieldAttribute = findRelationFieldAttribute;
function readReferentialActionArgument(arg) {
    const expr = (0, access_1.getArgumentExpression)(arg);
    if (expr.kind === "path") {
        return asReferentialAction((0, format_1.joinPath)(expr.value));
    }
    throw (0, access_1.getArgumentTypeError)(arg, "Referential action");
}
exports.readReferentialActionArgument = readReferentialActionArgument;
function findMapFieldAttribute(decl) {
    return parseUniqueAttributeWith(decl, "map", parseMapAttribute);
}
exports.findMapFieldAttribute = findMapFieldAttribute;
function findMapBlockAttribute(decl) {
    return parseUniqueAttributeWith(decl, "map", parseMapAttribute);
}
exports.findMapBlockAttribute = findMapBlockAttribute;
function parseMapAttribute(attr) {
    return {
        name: (0, access_1.readStringArgument)((0, access_1.getArgument)(attr.args, "name", 0)),
    };
}
function parseUniqueAttributeWith(decl, name, parser) {
    const attrs = (0, access_1.findAllAttributes)((0, access_1.getDeclarationAttributes)(decl), name);
    switch (attrs.length) {
        case 0:
            return undefined;
        case 1:
            return parseAttributeWith(attrs[0], decl, name, parser);
        default: {
            const prefixedName = prefixAttributeName(decl, name);
            throw new Error(`Multiple instances of ${prefixedName} attribute`);
        }
    }
}
function parseAttributesWith(decl, name, parser) {
    const attrs = (0, access_1.findAllAttributes)((0, access_1.getModelAttributes)(decl), name);
    return attrs.map((attr) => parseAttributeWith(attr, decl, name, parser));
}
function parseAttributeWith(attr, decl, name, parser) {
    try {
        return parser(attr);
    }
    catch (err) {
        const { message } = (0, catch_unknown_1.asError)(err);
        const atName = prefixAttributeName(decl, name);
        const declName = (0, access_1.getDeclarationName)(decl);
        let msg = `Invalid attribute ${atName}`;
        if (attr.location) {
            msg += ` at ${(0, format_1.formatSourceRange)(attr.location)}`;
        }
        msg += ` for ${declName}: ${message}`;
        throw new Error(msg, { cause: err });
    }
}
function prefixAttributeName(decl, name) {
    return ((0, access_1.hasBlockAttributes)(decl) ? "@@" : "@") + name;
}
function applyOptional(value, fn) {
    return value !== undefined ? fn(value) : undefined;
}
exports.applyOptional = applyOptional;
//# sourceMappingURL=attributes.js.map