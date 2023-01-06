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
var errorReporting_exports = {};
__export(errorReporting_exports, {
  ErrorKind: () => ErrorKind,
  createErrorReport: () => createErrorReport,
  makeErrorReportCompleted: () => makeErrorReportCompleted,
  uploadZip: () => uploadZip
});
module.exports = __toCommonJS(errorReporting_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
var import_node_fetch = __toESM(require("node-fetch"));
var ErrorKind = /* @__PURE__ */ ((ErrorKind2) => {
  ErrorKind2["JS_ERROR"] = "JS_ERROR";
  ErrorKind2["RUST_PANIC"] = "RUST_PANIC";
  return ErrorKind2;
})(ErrorKind || {});
async function uploadZip(zip, url) {
  return await (0, import_node_fetch.default)(url, {
    method: "PUT",
    agent: (0, import_fetch_engine.getProxyAgent)(url),
    headers: {
      "Content-Length": String(zip.byteLength)
    },
    body: zip
  });
}
__name(uploadZip, "uploadZip");
async function createErrorReport(data) {
  const result = await request(`mutation ($data: CreateErrorReportInput!) {
    createErrorReport(data: $data)
  }`, { data });
  return result.createErrorReport;
}
__name(createErrorReport, "createErrorReport");
async function makeErrorReportCompleted(signedUrl) {
  const result = await request(`mutation ($signedUrl: String!) {
  markErrorReportCompleted(signedUrl: $signedUrl)
}`, { signedUrl });
  return result.markErrorReportCompleted;
}
__name(makeErrorReportCompleted, "makeErrorReportCompleted");
async function request(query, variables) {
  const url = "https://error-reports.prisma.sh/";
  const body = JSON.stringify({
    query,
    variables
  });
  return await (0, import_node_fetch.default)(url, {
    method: "POST",
    agent: (0, import_fetch_engine.getProxyAgent)(url),
    body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then((res) => res.json()).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors));
    }
    return res.data;
  });
}
__name(request, "request");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorKind,
  createErrorReport,
  makeErrorReportCompleted,
  uploadZip
});
