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
var resolve_exports = {};
__export(resolve_exports, {
  resolve: () => resolve,
  resolvePkg: () => resolvePkg
});
module.exports = __toCommonJS(resolve_exports);
var import_path = __toESM(require("path"));
var import_resolve = __toESM(require("resolve"));
async function resolve(id, options) {
  const _options = { preserveSymlinks: false, ...options };
  return new Promise((res) => {
    (0, import_resolve.default)(id, _options, (e, v) => {
      if (e)
        res(void 0);
      res(v);
    });
  });
}
__name(resolve, "resolve");
async function resolvePkg(id, options) {
  const resolvedPath = await resolve(`${id}/package.json`, options);
  return resolvedPath && import_path.default.dirname(resolvedPath);
}
__name(resolvePkg, "resolvePkg");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolve,
  resolvePkg
});
