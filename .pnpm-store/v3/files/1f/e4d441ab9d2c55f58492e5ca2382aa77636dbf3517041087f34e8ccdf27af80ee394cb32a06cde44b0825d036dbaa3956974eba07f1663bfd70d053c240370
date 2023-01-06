"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var missingGeneratorMessage_exports = {};
__export(missingGeneratorMessage_exports, {
  missingGeneratorMessage: () => missingGeneratorMessage,
  missingModelMessage: () => missingModelMessage,
  missingModelMessageMongoDB: () => missingModelMessageMongoDB
});
module.exports = __toCommonJS(missingGeneratorMessage_exports);
var import_chalk = __toESM(require("chalk"));
var import_highlight = require("../highlight/highlight");
var import_link = require("./link");
const missingGeneratorMessage = `
${import_chalk.default.blue("info")} You don't have any generators defined in your ${import_chalk.default.bold("schema.prisma")}, so nothing will be generated.
You can define them like this:

${import_chalk.default.bold((0, import_highlight.highlightDatamodel)(`generator client {
  provider = "prisma-client-js"
}`))}`;
const missingModelMessage = `
You don't have any ${import_chalk.default.bold("models")} defined in your ${import_chalk.default.bold("schema.prisma")}, so nothing will be generated.
You can define a model like this:

${import_chalk.default.bold((0, import_highlight.highlightDatamodel)(`model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`))}

More information in our documentation:
${(0, import_link.link)("https://pris.ly/d/prisma-schema")}
`;
const missingModelMessageMongoDB = `
You don't have any ${import_chalk.default.bold("models")} defined in your ${import_chalk.default.bold("schema.prisma")}, so nothing will be generated.
You can define a model like this:

${import_chalk.default.bold((0, import_highlight.highlightDatamodel)(`model User {
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  email String  @unique
  name  String?
}`))}

More information in our documentation:
${(0, import_link.link)("https://pris.ly/d/prisma-schema")}
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  missingGeneratorMessage,
  missingModelMessage,
  missingModelMessageMongoDB
});
