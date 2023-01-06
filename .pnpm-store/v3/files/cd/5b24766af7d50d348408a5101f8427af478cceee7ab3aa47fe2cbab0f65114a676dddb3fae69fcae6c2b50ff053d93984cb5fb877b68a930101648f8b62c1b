var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  missingGeneratorMessage: () => missingGeneratorMessage,
  missingModelMessage: () => missingModelMessage,
  missingModelMessageMongoDB: () => missingModelMessageMongoDB
});
var import_chalk = __toModule(require("chalk"));
var import_highlight = __toModule(require("../highlight/highlight"));
var import_link = __toModule(require("../link"));
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
  id    String  @id @default(dbgenerated()) @map("_id") @db.ObjectId
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
