import { BfUserConfig, IBfConfigInternal } from "./types.js";

export function generateDefaultConfig(): BfUserConfig {
  return {
    settings: {
      srcDir: "src",
    },
  };
}

export function generateTsConfig(config: BfUserConfig) {
  const srcDir = config.settings.srcDir ?? "src";
  return {
    module: "commonjs",
    target: "es2017",
    outDir: "./.bf",
    esModuleInterop: true,
    strict: true,
    allowJs: true,
    baseUrl: "./",
    paths: {
      "~/*": [`./${srcDir}/*`],
    },
  };
}

const Listener = (cfg: IBfConfigInternal) => cfg;

export function definePlugin() {
  return {
    beforeServerStart: Listener,
    afterLoadConfig: Listener,
    afterServerStart: Listener,
  };
}