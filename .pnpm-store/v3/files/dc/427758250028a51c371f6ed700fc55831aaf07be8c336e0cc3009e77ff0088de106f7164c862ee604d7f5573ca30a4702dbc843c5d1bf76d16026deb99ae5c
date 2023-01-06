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
var getInternalDatamodelJson_exports = {};
__export(getInternalDatamodelJson_exports, {
  getInternalDatamodelJson: () => getInternalDatamodelJson
});
module.exports = __toCommonJS(getInternalDatamodelJson_exports);
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));
var import_byline = __toESM(require("../../tools/byline"));
function getInternalDatamodelJson(datamodel, schemaInferrerPath = import_path.default.join(__dirname, "../schema-inferrer-bin")) {
  return new Promise((resolve, reject) => {
    const proc = (0, import_child_process.spawn)(schemaInferrerPath, {
      stdio: ["pipe", "pipe", process.stderr]
    });
    proc.on("error", function(err) {
      console.error("[schema-inferrer-bin] error: %s", err);
      reject(err);
    });
    proc.on("exit", function(code, signal) {
      if (code !== 0) {
        console.error("[schema-inferrer-bin] exit: code=%s signal=%s", code, signal);
      }
      reject();
    });
    const out = (0, import_byline.default)(proc.stdout);
    out.on("data", (line) => {
      const result = JSON.parse(line);
      const resultB64 = Buffer.from(JSON.stringify(result)).toString("base64");
      resolve(resultB64);
    });
    const cut = datamodel.replace(/\n/g, " ");
    proc.stdin.write(JSON.stringify({ dataModel: cut }) + "\n");
  });
}
__name(getInternalDatamodelJson, "getInternalDatamodelJson");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInternalDatamodelJson
});
