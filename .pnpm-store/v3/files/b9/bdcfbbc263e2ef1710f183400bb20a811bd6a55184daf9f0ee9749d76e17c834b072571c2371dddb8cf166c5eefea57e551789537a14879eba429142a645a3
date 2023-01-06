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
var Generator_exports = {};
__export(Generator_exports, {
  Generator: () => Generator
});
module.exports = __toCommonJS(Generator_exports);
var import_generator_helper = require("@prisma/generator-helper");
var import_parseEnvValue = require("./utils/parseEnvValue");
class Generator {
  constructor(executablePath, config, isNode) {
    this.manifest = null;
    this.config = config;
    this.generatorProcess = new import_generator_helper.GeneratorProcess(executablePath, isNode);
  }
  async init() {
    await this.generatorProcess.init();
    this.manifest = await this.generatorProcess.getManifest(this.config);
  }
  stop() {
    this.generatorProcess.stop();
  }
  generate() {
    if (!this.options) {
      throw new Error(`Please first run .setOptions() on the Generator to initialize the options`);
    }
    return this.generatorProcess.generate(this.options);
  }
  setOptions(options) {
    this.options = options;
  }
  setBinaryPaths(binaryPaths) {
    if (!this.options) {
      throw new Error(`Please first run .setOptions() on the Generator to initialize the options`);
    }
    this.options.binaryPaths = binaryPaths;
  }
  getPrettyName() {
    var _a, _b;
    return (_b = (_a = this.manifest) == null ? void 0 : _a.prettyName) != null ? _b : this.getProvider();
  }
  getProvider() {
    return (0, import_parseEnvValue.parseEnvValue)(this.config.provider);
  }
}
__name(Generator, "Generator");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Generator
});
