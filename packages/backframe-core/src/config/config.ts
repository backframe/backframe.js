import { loadEnv, loadModule, logger, resolveCwd } from "@backframe/utils";
import { globbySync } from "@backframe/utils/globby";
import { BF_OUT_DIR, BfConfig } from "./index.js";
import { BfUserConfig } from "./schema.js";

export function defineConfig(config: BfUserConfig) {
  return config;
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
