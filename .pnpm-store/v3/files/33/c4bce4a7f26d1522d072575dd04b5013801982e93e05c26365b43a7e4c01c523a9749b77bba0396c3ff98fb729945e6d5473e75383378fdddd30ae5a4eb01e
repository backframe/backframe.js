var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  dotenvExpand: () => dotenvExpand
});
function dotenvExpand(config) {
  const environment = config.ignoreProcessEnv ? {} : process.env;
  const interpolate = (envValue) => {
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
  };
  for (const configKey in config.parsed) {
    const value = Object.hasOwnProperty.call(environment, configKey) ? environment[configKey] : config.parsed[configKey];
    config.parsed[configKey] = interpolate(value);
  }
  for (const processKey in config.parsed) {
    environment[processKey] = config.parsed[processKey];
  }
  return config;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dotenvExpand
});
