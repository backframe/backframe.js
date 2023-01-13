import { logger, require, resolveCwd } from "@backframe/utils";
import { globbySync } from "globby";
import yargs from "yargs";
import add from "./commands/add";
import db from "./commands/db";
import _new from "./commands/new";
import rest from "./commands/rest";
import serve from "./commands/serve";

export function buildCommands(cli: yargs.Argv) {
  // preserve order: commands without args first
  return [rest, serve, add, _new, db].forEach((c) => {
    cli.command(c.command, c.description, c.builder, c.handler);
    // check for command alias
    const alias = c.alias;
    if (alias) cli.alias(alias, c.command);
  });
}

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
