"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var highlight_exports = {};
__export(highlight_exports, {
  highlightDatamodel: () => highlightDatamodel,
  highlightSql: () => highlightSql,
  highlightTS: () => highlightTS
});
module.exports = __toCommonJS(highlight_exports);
var import_dml = require("./languages/dml");
var import_sql = require("./languages/sql");
var import_prism = require("./prism");
function highlightDatamodel(str) {
  return highlight(str, import_dml.dml);
}
__name(highlightDatamodel, "highlightDatamodel");
function highlightSql(str) {
  return highlight(str, import_sql.sql);
}
__name(highlightSql, "highlightSql");
function highlightTS(str) {
  return highlight(str, import_prism.Prism.languages.javascript);
}
__name(highlightTS, "highlightTS");
function highlight(str, grammar) {
  const tokens = import_prism.Prism.tokenize(str, grammar);
  return tokens.map((t) => import_prism.Token.stringify(t)).join("");
}
__name(highlight, "highlight");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  highlightDatamodel,
  highlightSql,
  highlightTS
});
