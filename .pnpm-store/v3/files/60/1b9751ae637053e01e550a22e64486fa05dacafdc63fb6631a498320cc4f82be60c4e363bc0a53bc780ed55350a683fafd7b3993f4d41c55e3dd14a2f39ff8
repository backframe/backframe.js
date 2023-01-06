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
var generatorHandler_exports = {};
__export(generatorHandler_exports, {
  generatorHandler: () => generatorHandler
});
module.exports = __toCommonJS(generatorHandler_exports);
var import_byline = __toESM(require("./byline"));
function generatorHandler(handler) {
  (0, import_byline.default)(process.stdin).on("data", async (line) => {
    const json = JSON.parse(String(line));
    if (json.method === "generate" && json.params) {
      try {
        const result = await handler.onGenerate(json.params);
        respond({
          jsonrpc: "2.0",
          result,
          id: json.id
        });
      } catch (_e) {
        const e = _e;
        respond({
          jsonrpc: "2.0",
          error: {
            code: -32e3,
            message: e.stack || e.message,
            data: null
          },
          id: json.id
        });
      }
    }
    if (json.method === "getManifest") {
      if (handler.onManifest) {
        try {
          const manifest = handler.onManifest(json.params);
          respond({
            jsonrpc: "2.0",
            result: {
              manifest
            },
            id: json.id
          });
        } catch (_e) {
          const e = _e;
          respond({
            jsonrpc: "2.0",
            error: {
              code: -32e3,
              message: e.stack || e.message,
              data: null
            },
            id: json.id
          });
        }
      } else {
        respond({
          jsonrpc: "2.0",
          result: {
            manifest: null
          },
          id: json.id
        });
      }
    }
  });
  process.stdin.resume();
}
__name(generatorHandler, "generatorHandler");
function respond(response) {
  console.error(JSON.stringify(response));
}
__name(respond, "respond");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generatorHandler
});
