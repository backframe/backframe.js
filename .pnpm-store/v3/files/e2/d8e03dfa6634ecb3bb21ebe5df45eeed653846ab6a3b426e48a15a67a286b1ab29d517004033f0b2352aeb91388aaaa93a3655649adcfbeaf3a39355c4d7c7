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
var getErrorMessageWithLink_exports = {};
__export(getErrorMessageWithLink_exports, {
  getErrorMessageWithLink: () => getErrorMessageWithLink
});
module.exports = __toCommonJS(getErrorMessageWithLink_exports);
var import_debug = require("@prisma/debug");
var import_chalk = __toESM(require("chalk"));
var import_strip_ansi = __toESM(require("strip-ansi"));
var import_util = require("../../utils/util");
var import_maskQuery = require("./maskQuery");
var import_normalizeLogs = require("./normalizeLogs");
function getErrorMessageWithLink({
  version,
  platform,
  title,
  description,
  engineVersion,
  database,
  query
}) {
  var _a, _b;
  const gotLogs = (0, import_debug.getLogs)(6e3 - ((_a = query == null ? void 0 : query.length) != null ? _a : 0));
  const logs = (0, import_normalizeLogs.normalizeLogs)((0, import_strip_ansi.default)(gotLogs));
  const moreInfo = description ? `# Description
\`\`\`
${description}
\`\`\`` : "";
  const body = (0, import_strip_ansi.default)(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${(_b = process.version) == null ? void 0 : _b.padEnd(19)}| 
| OS              | ${platform == null ? void 0 : platform.padEnd(19)}|
| Prisma Client   | ${version == null ? void 0 : version.padEnd(19)}|
| Query Engine    | ${engineVersion == null ? void 0 : engineVersion.padEnd(19)}|
| Database        | ${database == null ? void 0 : database.padEnd(19)}|

${moreInfo}

## Logs
\`\`\`
${logs}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${query ? (0, import_maskQuery.maskQuery)(query) : ""}
\`\`\`
`);
  const url = (0, import_util.getGithubIssueUrl)({ title, body });
  return `${title}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${import_chalk.default.underline(url)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
}
__name(getErrorMessageWithLink, "getErrorMessageWithLink");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getErrorMessageWithLink
});
