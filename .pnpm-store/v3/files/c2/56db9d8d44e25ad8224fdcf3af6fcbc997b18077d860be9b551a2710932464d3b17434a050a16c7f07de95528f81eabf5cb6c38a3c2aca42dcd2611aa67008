"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgumentValuesObject = exports.getArgumentValuesArray = exports.getArgumentValues = exports.getExpressionValue = exports.getArgumentTypeError = exports.readFieldReferencesArgument = exports.asFieldReferencesArgument = exports.readFieldReferenceArgument = exports.asFieldReferenceArgument = exports.readStringArgument = exports.asStringArgument = exports.readNumberArgument = exports.asNumberArgument = exports.readBooleanArgument = exports.asBooleanArgument = exports.getArgumentExpression = exports.getArgument = exports.findArgument = exports.findAllAttributes = exports.findFirstAttribute = exports.getEnumAttributes = exports.getModelAttributes = exports.getDeclarationAttributes = exports.hasFieldAttributes = exports.hasBlockAttributes = exports.getDeclarationName = void 0;
const no_case_1 = require("no-case");
const format_1 = require("./format");
function getDeclarationName(decl) {
    switch (decl.kind) {
        case "datasource":
        case "enum":
        case "enumValue":
        case "field":
        case "generator":
        case "model":
        case "type":
        case "typeAlias":
            return `${(0, no_case_1.noCase)(decl.kind)} ${decl.name.value}`;
        case "commentBlock":
            return "comment block";
    }
}
exports.getDeclarationName = getDeclarationName;
function hasBlockAttributes(decl) {
    switch (decl.kind) {
        case "enum":
        case "model":
        case "type":
            return true;
    }
    return false;
}
exports.hasBlockAttributes = hasBlockAttributes;
function hasFieldAttributes(decl) {
    switch (decl.kind) {
        case "enumValue":
        case "field":
        case "typeAlias":
            return true;
    }
    return false;
}
exports.hasFieldAttributes = hasFieldAttributes;
function getDeclarationAttributes(decl) {
    switch (decl.kind) {
        case "enum":
            return getEnumAttributes(decl);
        case "model":
        case "type":
            return getModelAttributes(decl);
        case "enumValue":
        case "field":
        case "typeAlias":
            return decl.attributes ?? [];
        default:
            return [];
    }
}
exports.getDeclarationAttributes = getDeclarationAttributes;
function getModelAttributes(decl) {
    return decl.members.filter((m) => m.kind === "blockAttribute");
}
exports.getModelAttributes = getModelAttributes;
function getEnumAttributes(decl) {
    return decl.members.filter((m) => m.kind === "blockAttribute");
}
exports.getEnumAttributes = getEnumAttributes;
function findFirstAttribute(attributes, name) {
    return attributes?.find((attribute) => (0, format_1.joinPath)(attribute.path.value) === name);
}
exports.findFirstAttribute = findFirstAttribute;
function findAllAttributes(attributes, name) {
    return (attributes?.filter((attribute) => (0, format_1.joinPath)(attribute.path.value) === name) ?? []);
}
exports.findAllAttributes = findAllAttributes;
function findArgument(args, name, position) {
    if (args) {
        const namedArg = args.find((arg) => arg.kind === "namedArgument" && arg.name.value === name);
        if (namedArg) {
            return namedArg;
        }
        const unnamedArgs = args.filter((arg) => arg.kind !== "namedArgument");
        if (position != null && position < unnamedArgs.length) {
            const expression = unnamedArgs[position];
            return {
                kind: "namedArgument",
                name: { kind: "name", value: name },
                expression,
            };
        }
    }
}
exports.findArgument = findArgument;
function getArgument(args, name, position) {
    const arg = findArgument(args, name, position);
    if (!arg) {
        throw new Error(`Argument "${name}" is required`);
    }
    return arg;
}
exports.getArgument = getArgument;
function getArgumentExpression(arg) {
    return arg.kind === "namedArgument" ? arg.expression : arg;
}
exports.getArgumentExpression = getArgumentExpression;
function asBooleanArgument(arg) {
    if (arg) {
        const expr = getArgumentExpression(arg);
        if (expr.kind === "literal" && typeof expr.value === "boolean") {
            return expr.value;
        }
    }
}
exports.asBooleanArgument = asBooleanArgument;
function readBooleanArgument(arg) {
    const value = asBooleanArgument(arg);
    if (value === undefined) {
        throw getArgumentTypeError(arg, "Boolean literal");
    }
    return value;
}
exports.readBooleanArgument = readBooleanArgument;
function asNumberArgument(arg) {
    if (arg) {
        const expr = getArgumentExpression(arg);
        if (expr.kind === "literal" && typeof expr.value === "number") {
            return expr.value;
        }
    }
}
exports.asNumberArgument = asNumberArgument;
function readNumberArgument(arg) {
    const value = asNumberArgument(arg);
    if (value === undefined) {
        throw getArgumentTypeError(arg, "Number literal");
    }
    return value;
}
exports.readNumberArgument = readNumberArgument;
function asStringArgument(arg) {
    if (arg) {
        const expr = getArgumentExpression(arg);
        if (expr.kind === "literal" && typeof expr.value === "string") {
            return expr.value;
        }
    }
}
exports.asStringArgument = asStringArgument;
function readStringArgument(arg) {
    const value = asStringArgument(arg);
    if (value === undefined) {
        throw getArgumentTypeError(arg, "String literal");
    }
    return value;
}
exports.readStringArgument = readStringArgument;
function asFieldReferenceArgument(arg) {
    if (arg) {
        const expr = getArgumentExpression(arg);
        if (expr.kind === "path") {
            return (0, format_1.joinPath)(expr.value);
        }
    }
}
exports.asFieldReferenceArgument = asFieldReferenceArgument;
function readFieldReferenceArgument(arg) {
    const value = asFieldReferenceArgument(arg);
    if (value === undefined) {
        throw getArgumentTypeError(arg, "Field reference");
    }
    return value;
}
exports.readFieldReferenceArgument = readFieldReferenceArgument;
function asFieldReferencesArgument(arg) {
    if (arg) {
        const expr = getArgumentExpression(arg);
        if (expr.kind === "array") {
            const items = expr.items.map(asFieldReferenceArgument);
            if (items.every((item) => typeof item === "string")) {
                return items;
            }
        }
    }
}
exports.asFieldReferencesArgument = asFieldReferencesArgument;
function readFieldReferencesArgument(arg) {
    const value = asFieldReferencesArgument(arg);
    if (value === undefined) {
        throw getArgumentTypeError(arg, "Field references");
    }
    return value;
}
exports.readFieldReferencesArgument = readFieldReferencesArgument;
function getArgumentTypeError(arg, expectedType) {
    let message = `${expectedType} expected`;
    let { kind } = arg;
    if (arg.kind === "namedArgument") {
        message += ` for argument ${arg.name.value}`;
        ({ kind } = arg.expression);
    }
    message += ` but got ${(0, no_case_1.noCase)(kind)}`;
    if (arg.kind === "literal") {
        message += ` ${typeof arg.value}`;
    }
    return new Error(message);
}
exports.getArgumentTypeError = getArgumentTypeError;
function getExpressionValue(expr) {
    switch (expr.kind) {
        case "literal":
            return expr.value;
        case "path":
            return (0, format_1.joinPath)(expr.value);
        case "array":
            return expr.items.map(getExpressionValue);
        case "functionCall":
            return (0, format_1.formatAst)(expr);
    }
}
exports.getExpressionValue = getExpressionValue;
function getArgumentValues(args) {
    if (args.every((arg) => arg.kind === "namedArgument")) {
        return getArgumentValuesObject(args);
    }
    return getArgumentValuesArray(args);
}
exports.getArgumentValues = getArgumentValues;
function getArgumentValuesArray(args) {
    return args.map((arg) => getExpressionValue(arg.kind === "namedArgument" ? arg.expression : arg));
}
exports.getArgumentValuesArray = getArgumentValuesArray;
function getArgumentValuesObject(args) {
    return Object.fromEntries(args.map((arg) => {
        const name = arg.name.value;
        const value = getExpressionValue(arg.expression);
        return [name, value];
    }));
}
exports.getArgumentValuesObject = getArgumentValuesObject;
//# sourceMappingURL=access.js.map