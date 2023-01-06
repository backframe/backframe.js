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
  getErrorMessageWithLink: () => getErrorMessageWithLink
});
var import_debug = __toModule(require("@prisma/debug"));
var import_util = __toModule(require("../../utils/util"));
var import_strip_ansi = __toModule(require("strip-ansi"));
var import_maskQuery = __toModule(require("./maskQuery"));
var import_normalizeLogs = __toModule(require("./normalizeLogs"));
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

${(0, import_util.link)(url)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getErrorMessageWithLink
});
