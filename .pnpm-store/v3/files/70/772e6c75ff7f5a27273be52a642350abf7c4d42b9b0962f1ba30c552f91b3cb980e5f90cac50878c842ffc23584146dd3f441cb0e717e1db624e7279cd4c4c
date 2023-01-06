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
var ServerError_exports = {};
__export(ServerError_exports, {
  ServerError: () => ServerError
});
module.exports = __toCommonJS(ServerError_exports);
var import_DataProxyAPIError = require("./DataProxyAPIError");
var import_setRetryable = require("./utils/setRetryable");
const SERVER_ERROR_DEFAULT_MESSAGE = "Unknown server error";
class ServerError extends import_DataProxyAPIError.DataProxyAPIError {
  constructor(info, message, logs) {
    super(message || SERVER_ERROR_DEFAULT_MESSAGE, (0, import_setRetryable.setRetryable)(info, true));
    this.name = "ServerError";
    this.code = "P5006";
    this.logs = logs;
  }
}
__name(ServerError, "ServerError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ServerError
});
