import dotenv from "dotenv";
import { globbySync } from "globby";
import { logger } from "./index.js";

export function setEnv(env: string) {
  process.env.NODE_ENV = env;
}

export function env(key: string, defaultValue?: string) {
  loadEnv();
  return process.env[key] ?? defaultValue;
}

export function loadEnv(silent = true) {
  globbySync(".env*")
    .filter((f) => !f.includes(".example"))
    .forEach((file) => {
      dotenv.config({ path: file });
      !silent && logger.info(`loaded env vars from ${file}`);
    });
}
