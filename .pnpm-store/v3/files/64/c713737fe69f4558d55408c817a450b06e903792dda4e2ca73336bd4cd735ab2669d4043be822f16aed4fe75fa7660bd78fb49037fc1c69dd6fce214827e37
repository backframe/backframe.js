"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var NetworkError_exports = {};
__export(NetworkError_exports, {
  RequestError: () => RequestError
});
module.exports = __toCommonJS(NetworkError_exports);
var import_DataProxyError = require("./DataProxyError");
var import_setRetryable = require("./utils/setRetryable");
class RequestError extends import_DataProxyError.DataProxyError {
  constructor(message, info) {
    super(`Cannot fetch data from service:
${message}`, (0, import_setRetryable.setRetryable)(info, true));
    this.name = "RequestError";
    this.code = "P5010";
  }
}
__name(RequestError, "RequestError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RequestError
});
