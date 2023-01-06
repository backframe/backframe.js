var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  convertLog: () => convertLog,
  getBacktraceFromLog: () => getBacktraceFromLog,
  getBacktraceFromRustError: () => getBacktraceFromRustError,
  getMessage: () => getMessage,
  isRustError: () => isRustError,
  isRustErrorLog: () => isRustErrorLog,
  isRustLog: () => isRustLog
});
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
function isRustLog(e) {
  return e.timestamp && typeof e.level === "string" && typeof e.target === "string";
}
function isRustErrorLog(e) {
  var _a, _b;
  return isRustLog(e) && (e.level === "error" || ((_b = (_a = e.fields) == null ? void 0 : _a.message) == null ? void 0 : _b.includes("fatal error")));
}
function isRustError(e) {
  return typeof e.is_panic !== "undefined";
}
function convertLog(rustLog) {
  const isQuery = isQueryLog(rustLog.fields);
  const level = isQuery ? "query" : rustLog.level.toLowerCase();
  return {
    ...rustLog,
    level,
    timestamp: new Date(new Date().getFullYear() + " " + rustLog.timestamp)
  };
}
function isQueryLog(fields) {
  return Boolean(fields.query);
}
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
