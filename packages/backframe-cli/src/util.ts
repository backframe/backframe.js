import { logger, require, resolveCwd } from "@backframe/utils";
import { Command } from "commander";
import { globbySync } from "globby";

export function ensureBfProject() {
  const pkg = require(resolveCwd("package.json"));
  const deps = Object.keys(pkg.dependencies);

  const exists = () => {
    const matches = globbySync("bf.config.*");
    if (matches.length) return true;
    if (!deps.includes("@backframe/core")) return true;
    return false;
  };

  if (!exists()) {
    logger.error(
      "This command can only be run from the root of a backframe project"
    );
    process.exit(10);
  }
}

export function defineCommand(opts: {
  command: string;
  description: string;
  aliases?: string[];
  builder?: (cmd: Command) => Command;
  action?: (...args: unknown[]) => void;
}) {
  return opts;
}
