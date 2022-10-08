/* eslint-disable @typescript-eslint/no-var-requires */
import { logger } from "@backframe/utils";
import dotenv from "dotenv";
import { buildSync } from "esbuild";
import pkg from "glob";
import path from "path";
import { BfConfig, BfConfigSchema, IBfConfigInternal } from "./types.js";
import { generateDefaultConfig } from "./utils.js";
const { glob } = pkg;

const current = (...s: string[]) => path.join(process.cwd(), ...s);

export async function loadConfig() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let module: any;
  let config: BfConfig;
  const pkg = require(path.join(process.cwd(), "package.json"));
  const format = pkg.type === "module" ? "esm" : "cjs";
  const cfgMatches = glob.sync("./bf.config.*");

  if (!cfgMatches.length) {
    logger.warn("no config file found. using default backframe config");
    config = generateDefaultConfig();
  } else {
    const match = cfgMatches[0] ?? "";
    if (match.includes(".mjs")) {
      buildSync({
        format: "cjs",
        entryPoints: [match],
        platform: "node",
        outdir: "./node_modules/.bf",
      });

      module = require(current("node_modules/.bf/bf.config.js"));
    } else {
      module = require(current(match));
    }
  }

  config = { ...generateDefaultConfig(), ...(module?.default ?? module) };
  const opts = BfConfigSchema.safeParse(config);
  if (!opts.success) {
    logger.error("your config file is not valid");
  }

  const expanded: IBfConfigInternal = { ...config, getFileSource: () => "src" };

  // Probe fs
  const src = config.settings.srcDir ?? "src";
  if (glob.sync(`./${src}/**/*.ts`).length) {
    buildSync({
      format,
      outdir: ".bf",
      entryPoints: glob.sync(`./${src}/**/*.{ts,js}`),
      keepNames: true,
    });

    expanded.metadata = {
      ...expanded.metadata,
      ...{ fileSrc: ".bf", typescript: true },
    };
  }

  // 1: Load env
  let env = glob.sync(".env*");
  env = env.filter((f) => f !== ".env.example");
  if (env.length) {
    dotenv.config({
      path: env[0],
    });
    logger.info(`Loaded env variables from ${env[0]}`);
  }

  // 3: set defaults and so on;
  expanded.getFileSource = () => {
    if (expanded.metadata?.fileSrc) return expanded.metadata.fileSrc;
    return expanded.settings.srcDir;
  };

  // TODO: Expand config: set defaults etc
  // TODO: Traverse plugins and begin invoking them.
  // TODO: Decide how to handle typescript

  return expanded;
}
