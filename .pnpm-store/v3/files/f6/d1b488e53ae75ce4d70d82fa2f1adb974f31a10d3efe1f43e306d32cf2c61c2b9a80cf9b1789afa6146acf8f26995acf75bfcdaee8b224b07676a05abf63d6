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
var log_exports = {};
__export(log_exports, {
  convertLog: () => convertLog,
  getBacktraceFromLog: () => getBacktraceFromLog,
  getBacktraceFromRustError: () => getBacktraceFromRustError,
  getMessage: () => getMessage,
  isRustError: () => isRustError,
  isRustErrorLog: () => isRustErrorLog,
  isRustLog: () => isRustLog
});
module.exports = __toCommonJS(log_exports);
function getMessage(log) {
  if (typeof log === "string") {
    return log;
  } else if (isRustError(log)) {
    return getBacktraceFromRustError(log);
  } else if (isRustLog(log)) {
    return getBacktraceFromLog(log);
  }
  return JSON.stringify(log);
}
__name(getMessage, "getMessage");
function getBacktraceFromLog(log) {
  var _a, _b, _c, _d, _e, _f, _g;
  if ((_a = log.fields) == null ? void 0 : _a.message) {
    let str = (_b = log.fields) == null ? void 0 : _b.message;
    if ((_c = log.fields) == null ? void 0 : _c.file) {
      str += ` in ${log.fields.file}`;
      if ((_d = log.fields) == null ? void 0 : _d.line) {
        str += `:${log.fields.line}`;
      }
      if ((_e = log.fields) == null ? void 0 : _e.column) {
        str += `:${log.fields.column}`;
      }
    }
    if ((_f = log.fields) == null ? void 0 : _f.reason) {
      str += `
${(_g = log.fields) == null ? void 0 : _g.reason}`;
    }
    return str;
  }
  return "Unknown error";
}
__name(getBacktraceFromLog, "getBacktraceFromLog");
function getBacktraceFromRustError(err) {
  let str = "";
  if (err.is_panic) {
    str += `PANIC`;
  }
  if (err.backtrace) {
    str += ` in ${err.backtrace}`;
  }
  if (err.message) {
    str += `
${err.message}`;
  }
  return str;
}
__name(getBacktraceFromRustError, "getBacktraceFromRustError");
function isRustLog(e) {
  return e.timestamp && typeof e.level === "string" && typeof e.target === "string";
}
__name(isRustLog, "isRustLog");
function isRustErrorLog(e) {
  var _a, _b;
  return isRustLog(e) && (e.level === "error" || ((_b = (_a = e.fields) == null ? void 0 : _a.message) == null ? void 0 : _b.includes("fatal error")));
}
__name(isRustErrorLog, "isRustErrorLog");
function isRustError(e) {
  return typeof e.is_panic !== "undefined";
}
__name(isRustError, "isRustError");
function convertLog(rustLog) {
  const isQuery = isQueryLog(rustLog.fields);
  const level = isQuery ? "query" : rustLog.level.toLowerCase();
  return {
    ...rustLog,
    level,
    timestamp: new Date(rustLog.timestamp)
  };
}
__name(convertLog, "convertLog");
function isQueryLog(fields) {
  return Boolean(fields.query);
}
__name(isQueryLog, "isQueryLog");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertLog,
  getBacktraceFromLog,
  getBacktraceFromRustError,
  getMessage,
  isRustError,
  isRustErrorLog,
  isRustLog
});
