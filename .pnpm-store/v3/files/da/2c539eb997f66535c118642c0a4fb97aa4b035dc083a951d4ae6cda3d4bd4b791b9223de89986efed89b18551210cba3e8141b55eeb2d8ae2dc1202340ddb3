var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  normalizeLogs: () => normalizeLogs
});
function normalizeLogs(logs) {
  return logs.split("\n").map((l) => {
    return l.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/, "").replace(/\+\d+\s*ms$/, "");
  }).join("\n");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalizeLogs
});
