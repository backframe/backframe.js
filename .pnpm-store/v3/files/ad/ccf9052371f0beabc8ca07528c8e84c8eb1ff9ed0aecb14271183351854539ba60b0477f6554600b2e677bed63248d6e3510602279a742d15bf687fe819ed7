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
var formatTable_exports = {};
__export(formatTable_exports, {
  formatTable: () => formatTable
});
module.exports = __toCommonJS(formatTable_exports);
function slugify(str) {
  return str.toString().toLowerCase().replace(/\s+/g, "-");
}
__name(slugify, "slugify");
function formatTable(rows, options = { json: false }) {
  if (options.json) {
    const result = rows.reduce((acc, [name, value]) => {
      acc[slugify(name)] = value;
      return acc;
    }, {});
    return JSON.stringify(result, null, 2);
  }
  const maxPad = rows.reduce((acc, curr) => Math.max(acc, curr[0].length), 0);
  return rows.map(([left, right]) => `${left.padEnd(maxPad)} : ${right}`).join("\n");
}
__name(formatTable, "formatTable");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatTable
});
