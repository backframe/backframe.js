"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrismaExpression = exports.parsePrismaType = exports.parsePrismaSchema = void 0;
const parser_1 = require("./__generated__/parser");
function parsePrismaSchema(source) {
    return (0, parser_1.parse)(source);
}
exports.parsePrismaSchema = parsePrismaSchema;
function parsePrismaType(source) {
    return (0, parser_1.parse)(source, { startRule: "field_type" });
}
exports.parsePrismaType = parsePrismaType;
function parsePrismaExpression(source) {
    return (0, parser_1.parse)(source, {
        startRule: "expression",
    });
}
exports.parsePrismaExpression = parsePrismaExpression;
//# sourceMappingURL=parse.js.map