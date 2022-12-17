#!/usr/bin/env node

import yargs from "yargs";
import { buildCommands } from "./util";

let cli = yargs(process.env.argv).parserConfiguration({
  "boolean-negation": true,
});

cli
  .scriptName("bf")
  .usage("Usage: $0 <command> [options]")
  .alias("h", "help")
  .alias("v", "version");

try {
  const { version } = require("../package.json");
  cli.version("version", "Show the backframe CLI version info", version);
} catch (e) {
  // ignore
}

buildCommands(cli);

cli
  .wrap(cli.terminalWidth())
  .demandCommand(1, "Pass --help to see all available commands and options.")
  .strict()
  .recommendCommands()
  .parse(process.argv.slice(2));
