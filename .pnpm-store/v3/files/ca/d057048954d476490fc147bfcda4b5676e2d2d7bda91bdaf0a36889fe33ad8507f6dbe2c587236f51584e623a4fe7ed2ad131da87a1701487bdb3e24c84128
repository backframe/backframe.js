var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  getInternalDatamodelJson: () => getInternalDatamodelJson
});
var import_path = __toModule(require("path"));
var import_child_process = __toModule(require("child_process"));
var import_byline = __toModule(require("../../tools/byline"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInternalDatamodelJson
});
