import { logger } from "@backframe/utils";
import dotenv from "dotenv";
import { buildSync } from "esbuild";
import pkg from "glob";
import path from "path";
import { BfConfigSchema } from "./types";
const { glob } = pkg;

const CONFIG_FILE = "bf.config";

export async function loadConfig() {
  // Check if a config file exists
  const configFiles = glob.sync(`./${CONFIG_FILE}.*`);
  if (!configFiles.length) {
    logger.error(
      `A "${CONFIG_FILE}.ts" or "${CONFIG_FILE}.js" file could not be detected in your current dir. Please make sure you have configured your project correctly and are in the root dir.`
    );
    process.exit(1);
  }

  // Load env
  let env = glob.sync(".env*");
  env = env.filter((f) => f !== ".env.example");
  if (env.length) {
    dotenv.config({
      path: env[0],
    });
    logger.info(`Loaded env variables from ${env[0]}`);
  }

  // Transpile files
  const files = glob.sync("./src/**/*.{ts,js}");
  if (configFiles[0].includes(".ts")) {
    files.push(`./${CONFIG_FILE}.ts`);
  } else {
    files.push(`./${CONFIG_FILE}.js`);
  }
  buildSync({
    entryPoints: files,
    outdir: ".bf",
    format: "cjs",
  });

  // Load config file
  const filePath = path.join(process.cwd(), ".bf", `${CONFIG_FILE}.js`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module = require(filePath);
  const config = module.default;

  if (!config || !Object.keys(config).length) {
    logger.error(
      `The config file at ${filePath} does not export a default object. Please make sure it is configured correctly.`
    );
    process.exit(1);
  }

  // Validate config
  const opts = BfConfigSchema.safeParse(config);
  if (!opts.success) {
    logger.error(
      `The config file at ${filePath} is not valid. Please make sure it is configured correctly.`
    );
    logger.error(opts.error);
    process.exit(1);
  }

  // TODO: Set defaults
  // TODO: Invoke hooks(plugins)
  return config;
}
