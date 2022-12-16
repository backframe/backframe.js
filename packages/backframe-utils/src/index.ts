export { logger } from "./logger.js";
export { loadModule, require, resolveCwd, resolvePackage } from "./pkg.js";

export function debug(msg: string) {
  if (process.env.BF_DEBUG) {
    console.log(msg);
  }
}
