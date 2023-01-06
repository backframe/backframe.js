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
var BadRequestError_exports = {};
__export(BadRequestError_exports, {
  BadRequestError: () => BadRequestError
});
module.exports = __toCommonJS(BadRequestError_exports);
var import_DataProxyAPIError = require("./DataProxyAPIError");
var import_setRetryable = require("./utils/setRetryable");
const BAD_REQUEST_DEFAULT_MESSAGE = "This request could not be understood by the server";
class BadRequestError extends import_DataProxyAPIError.DataProxyAPIError {
  constructor(info, message, code) {
    super(message || BAD_REQUEST_DEFAULT_MESSAGE, (0, import_setRetryable.setRetryable)(info, false));
    this.name = "BadRequestError";
    this.code = "P5000";
    if (code)
      this.code = code;
  }
}
__name(BadRequestError, "BadRequestError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadRequestError
});
