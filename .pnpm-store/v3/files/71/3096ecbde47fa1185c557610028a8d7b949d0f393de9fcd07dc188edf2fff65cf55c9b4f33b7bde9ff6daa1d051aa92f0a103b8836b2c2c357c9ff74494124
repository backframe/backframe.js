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
var dotenvExpand_exports = {};
__export(dotenvExpand_exports, {
  dotenvExpand: () => dotenvExpand
});
module.exports = __toCommonJS(dotenvExpand_exports);
function dotenvExpand(config) {
  const environment = config.ignoreProcessEnv ? {} : process.env;
  const interpolate = /* @__PURE__ */ __name((envValue) => {
    const matches = envValue.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g) || [];
    return matches.reduce(function(newEnv, match) {
      const parts = /(.?)\${([a-zA-Z0-9_]+)?}/g.exec(match);
      if (!parts) {
        return newEnv;
      }
      const prefix = parts[1];
      let value, replacePart;
      if (prefix === "\\") {
        replacePart = parts[0];
        value = replacePart.replace("\\$", "$");
      } else {
        const key = parts[2];
        replacePart = parts[0].substring(prefix.length);
        value = Object.hasOwnProperty.call(environment, key) ? environment[key] : config.parsed[key] || "";
        value = interpolate(value);
      }
      return newEnv.replace(replacePart, value);
    }, envValue);
  }, "interpolate");
  for (const configKey in config.parsed) {
    const value = Object.hasOwnProperty.call(environment, configKey) ? environment[configKey] : config.parsed[configKey];
    config.parsed[configKey] = interpolate(value);
  }
  for (const processKey in config.parsed) {
    environment[processKey] = config.parsed[processKey];
  }
  return config;
}
__name(dotenvExpand, "dotenvExpand");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dotenvExpand
});
