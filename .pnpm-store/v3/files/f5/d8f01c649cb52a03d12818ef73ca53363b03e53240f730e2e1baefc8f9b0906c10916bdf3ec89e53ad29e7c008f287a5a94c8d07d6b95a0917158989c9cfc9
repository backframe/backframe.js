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
var maskSchema_exports = {};
__export(maskSchema_exports, {
  mapScalarValues: () => mapScalarValues,
  maskSchema: () => maskSchema
});
module.exports = __toCommonJS(maskSchema_exports);
function maskSchema(schema) {
  const regex = /url\s*=\s*.+/;
  return schema.split("\n").map((line) => {
    const match = regex.exec(line);
    if (match) {
      return `${line.slice(0, match.index)}url = "***"`;
    }
    return line;
  }).join("\n");
}
__name(maskSchema, "maskSchema");
function mapScalarValues(obj, mapper) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      result[key] = mapScalarValues(obj[key], mapper);
    } else {
      result[key] = mapper(obj[key]);
    }
  }
  return result;
}
__name(mapScalarValues, "mapScalarValues");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapScalarValues,
  maskSchema
});
