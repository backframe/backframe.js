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
var util_exports = {};
__export(util_exports, {
  fixBinaryTargets: () => fixBinaryTargets,
  getGithubIssueUrl: () => getGithubIssueUrl,
  getRandomString: () => getRandomString,
  plusX: () => plusX
});
module.exports = __toCommonJS(util_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_crypto = __toESM(require("crypto"));
var import_fs = __toESM(require("fs"));
var import_new_github_issue_url = __toESM(require("new-github-issue-url"));
const debug = (0, import_debug.default)("plusX");
function plusX(file) {
  const s = import_fs.default.statSync(file);
  const newMode = s.mode | 64 | 8 | 1;
  if (s.mode === newMode) {
    debug(`Execution permissions of ${file} are fine`);
    return;
  }
  const base8 = newMode.toString(8).slice(-3);
  debug(`Have to call plusX on ${file}`);
  import_fs.default.chmodSync(file, base8);
}
__name(plusX, "plusX");
function transformPlatformToEnvValue(platform) {
  return { fromEnvVar: null, value: platform };
}
__name(transformPlatformToEnvValue, "transformPlatformToEnvValue");
function fixBinaryTargets(binaryTargets, platform) {
  binaryTargets = binaryTargets || [];
  if (!binaryTargets.find((object) => object.value === "native")) {
    return [transformPlatformToEnvValue("native"), ...binaryTargets];
  }
  return [...binaryTargets, transformPlatformToEnvValue(platform)];
}
__name(fixBinaryTargets, "fixBinaryTargets");
function getGithubIssueUrl({
  title,
  user = "prisma",
  repo = "prisma",
  template = "bug_report.md",
  body
}) {
  return (0, import_new_github_issue_url.default)({
    user,
    repo,
    template,
    title,
    body
  });
}
__name(getGithubIssueUrl, "getGithubIssueUrl");
function getRandomString() {
  return import_crypto.default.randomBytes(12).toString("hex");
}
__name(getRandomString, "getRandomString");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fixBinaryTargets,
  getGithubIssueUrl,
  getRandomString,
  plusX
});
