import {
  loadEnv,
  loadModule,
  logger,
  require,
  resolveCwd,
} from "@backframe/utils";
import { globbySync } from "@backframe/utils/globby";
import fs from "fs";
import { BF_OUT_DIR, BfConfig } from "./index.js";
import { BfUserConfig } from "./schema.js";
import { BfSettingsSchema } from "./settings.js";

const BF_SETTINGS = "bf.settings.json";

export function defineConfig(config: BfUserConfig) {
  return config;
}

export function loadSettings() {
  let module = {};
  const matches = globbySync(`./${BF_SETTINGS}`);
  if (!matches.length) {
    logger.warn("no settings file found, using default backframe settings");
  } else {
    const m = matches[0];
    module = require(resolveCwd(m));
    logger.info("loaded settings successfully");
  }

  const result = BfSettingsSchema.safeParse(module);

  if (result.success === false) {
    const errors: Record<string, string[]> = result.error.flatten().fieldErrors;
    logger.error("invalid settings file found");
    console.error(errors);
    process.exit(10);
  }

  if (!matches.length) {
    fs.writeFileSync(`./${BF_SETTINGS}`, JSON.stringify(result.data, null, 2));
  }

  return result.data;
}

// find bf.config.{ts,js,mjs} file and load the module
export async function openConfig() {
  let userCfg: BfUserConfig = {};
  let module: { default: BfUserConfig } | BfUserConfig = {};
  const matches = globbySync(`${BF_OUT_DIR}/bf.config.*`);

  if (!matches.length) {
    logger.warn("no config file found, using default backframe config");
  } else {
    const m = matches[0];
    module = await loadModule(resolveCwd(m));
    logger.info("loaded config successfully");
  }

  userCfg =
    (module as { default: BfUserConfig }).default ?? (module as BfUserConfig);
  return userCfg;
}

export async function loadConfig() {
  // Load env vars(they might be needed in the later steps)
  loadEnv(false);

  // expand config
  const bfConfig = new BfConfig();
  await bfConfig.$initialize();

  return bfConfig;
}
