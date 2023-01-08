import { loadModule, logger, resolveCwd } from "@backframe/utils";
import dotenv from "dotenv";
import { buildSync } from "esbuild";
import { globby, globbySync } from "globby";
import { BfConfig } from "./index.js";
import { BfUserConfig, BfUserConfigSchema } from "./schema.js";

export function defineConfig(config: BfUserConfig) {
  return config;
}

export function env(key: string, defaultValue?: string) {
  globbySync("./.env*")
    .filter((f) => !f.includes(".example"))
    .forEach((file) => {
      dotenv.config({ path: file });
    });
  return process.env[key] ?? defaultValue;
}

// find bf.config.{ts,js,mjs} file and load the module
async function openConfig() {
  let userCfg: BfUserConfig = {};
  let module: { default: BfUserConfig } | BfUserConfig = {};
  const matches = await globby("./bf.config.*");

  if (!matches.length) {
    logger.warn("no config file found, using default backframe config");
  } else {
    const m = matches[0];

    if (m.includes(".ts")) {
      const outfile = "./node_modules/.bf/bf.config.mjs";
      buildSync({
        outfile,
        format: "esm",
        entryPoints: [m],
      });
      module = await loadModule(resolveCwd(outfile));
    } else {
      module = await loadModule(resolveCwd(m));
    }
    logger.info("loaded config successfully");
  }

  userCfg =
    (module as { default: BfUserConfig }).default ?? (module as BfUserConfig);
  return userCfg;
}

export async function loadConfig() {
  // Load env vars(they might be needed in the later steps)
  globbySync(".env*")
    .filter((f) => !f.includes(".example"))
    .forEach((file) => {
      dotenv.config({ path: file });
      logger.info(`loaded env vars from ${file}`);
    });

  const cfg = await openConfig();
  const opts = BfUserConfigSchema.safeParse(cfg);

  if (!opts.success) {
    logger.error("your config file is not valid");
    process.exit(1);
  }

  // expand config
  return new BfConfig(cfg);
}
