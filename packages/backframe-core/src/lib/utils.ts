import { BfConfig } from "./types.js";

export function generateDefaultConfig(): BfConfig {
  return {
    settings: {
      srcDir: "src",
      platform: "express",
    },
  };
}

export function generateTsConfig(config: BfConfig) {
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
