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
var trimBlocksFromSchema_exports = {};
__export(trimBlocksFromSchema_exports, {
  trimBlocksFromSchema: () => trimBlocksFromSchema,
  trimNewLine: () => trimNewLine
});
module.exports = __toCommonJS(trimBlocksFromSchema_exports);
function trimNewLine(str) {
  if (str === "") {
    return str;
  }
  let newStr = str;
  if (/\r?\n|\r/.exec(newStr[0])) {
    newStr = newStr.slice(1);
  }
  if (newStr.length > 0 && /\r?\n|\r/.exec(newStr[newStr.length - 1])) {
    newStr = newStr.slice(0, newStr.length - 1);
  }
  return newStr;
}
__name(trimNewLine, "trimNewLine");
function trimBlocksFromSchema(str, blocks = ["model", "enum", "datasource", "generator"]) {
  const lines = str.split("\n");
  if (lines.length <= 2) {
    return str;
  }
  const modelPositions = [];
  let blockOpen = false;
  let currentStart = -1;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (blocks.some((b) => line.startsWith(b)) && line.endsWith("{")) {
      blockOpen = true;
      currentStart = index;
    }
    if (trimmed.endsWith("}") && currentStart > -1 && blockOpen) {
      modelPositions.push({
        start: currentStart,
        end: index
      });
      blockOpen = false;
      currentStart = -1;
    }
  });
  if (modelPositions.length === 0) {
    return str;
  }
  return trimNewLine(modelPositions.reduceRight((acc, position) => {
    acc.splice(position.start, position.end - position.start + 1);
    return acc;
  }, lines).join("\n"));
}
__name(trimBlocksFromSchema, "trimBlocksFromSchema");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  trimBlocksFromSchema,
  trimNewLine
});
