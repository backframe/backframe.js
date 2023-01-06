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
var getClientVersion_exports = {};
__export(getClientVersion_exports, {
  getClientVersion: () => getClientVersion
});
module.exports = __toCommonJS(getClientVersion_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_package = require("@prisma/engines/package.json");
var import_NotImplementedYetError = require("../errors/NotImplementedYetError");
var import_request = require("./request");
const semverRegex = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
const debug = (0, import_debug.default)("prisma:client:dataproxyEngine");
async function _getClientVersion(config) {
  var _a, _b, _c;
  const clientVersion = (_a = config.clientVersion) != null ? _a : "unknown";
  if (process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) {
    return process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
  }
  const [version, suffix] = (_b = clientVersion == null ? void 0 : clientVersion.split("-")) != null ? _b : [];
  if (suffix === void 0 && semverRegex.test(version)) {
    return version;
  }
  if (suffix !== void 0 || clientVersion === "0.0.0") {
    const [version2] = (_c = import_package.version.split("-")) != null ? _c : [];
    const [major, minor, patch] = version2.split(".");
    const pkgURL = prismaPkgURL(`<=${major}.${minor}.${patch}`);
    const res = await (0, import_request.request)(pkgURL, { clientVersion });
    return (await res.json())["version"];
  }
  throw new import_NotImplementedYetError.NotImplementedYetError("Only `major.minor.patch` versions are supported by Prisma Data Proxy.", {
    clientVersion
  });
}
__name(_getClientVersion, "_getClientVersion");
async function getClientVersion(config) {
  const version = await _getClientVersion(config);
  debug("version", version);
  return version;
}
__name(getClientVersion, "getClientVersion");
function prismaPkgURL(version) {
  return encodeURI(`https://unpkg.com/prisma@${version}/package.json`);
}
__name(prismaPkgURL, "prismaPkgURL");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getClientVersion
});
