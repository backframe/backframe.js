"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var drawBox_exports = {};
__export(drawBox_exports, {
  drawBox: () => drawBox
});
module.exports = __toCommonJS(drawBox_exports);
var import_chalk = __toESM(require("chalk"));
var import_cli_truncate = __toESM(require("cli-truncate"));
var import_string_width = __toESM(require("string-width"));
const chars = {
  topLeft: "\u250C",
  topRight: "\u2510",
  bottomRight: "\u2518",
  bottomLeft: "\u2514",
  vertical: "\u2502",
  horizontal: "\u2500"
};
function maxLineLength(str) {
  return str.split("\n").reduce((max, curr) => Math.max(max, (0, import_string_width.default)(curr)), 0) + 2;
}
__name(maxLineLength, "maxLineLength");
function drawBox({ title, width, height, str, horizontalPadding }) {
  horizontalPadding = horizontalPadding || 0;
  width = width || maxLineLength(str) + horizontalPadding * 2;
  const topLine = title ? import_chalk.default.grey(chars.topLeft + chars.horizontal) + " " + import_chalk.default.reset.bold(title) + " " + import_chalk.default.grey(chars.horizontal.repeat(width - title.length - 2 - 3) + chars.topRight) + import_chalk.default.reset() : import_chalk.default.grey(chars.topLeft + chars.horizontal) + import_chalk.default.grey(chars.horizontal.repeat(width - 3) + chars.topRight);
  const bottomLine = chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight;
  const lines = str.split("\n");
  if (lines.length < height) {
    lines.push(...new Array(height - lines.length).fill(""));
  }
  const mappedLines = lines.slice(-height).map((l) => {
    const lineWidth = Math.min((0, import_string_width.default)(l), width);
    const paddingRight = Math.max(width - lineWidth - 2, 0);
    return `${import_chalk.default.grey(chars.vertical)}${" ".repeat(horizontalPadding)}${import_chalk.default.reset((0, import_cli_truncate.default)(l, width - 2))}${" ".repeat(paddingRight - horizontalPadding)}${import_chalk.default.grey(chars.vertical)}`;
  }).join("\n");
  return import_chalk.default.grey(topLine + "\n" + mappedLines + "\n" + bottomLine);
}
__name(drawBox, "drawBox");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  drawBox
});
