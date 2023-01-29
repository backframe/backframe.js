#!/usr/bin/env node

import { logger } from "@backframe/utils";
import { Command } from "commander";
import * as commands from "./commands";
import { ICommandConfig } from "./commands/util";

const program = new Command();

program.name("bf").version("0.0.1").usage("<command> [options]");

for (const [_, command] of Object.entries(commands)) {
  const cfg = command.default as ICommandConfig;

  cfg.builder(
    program
      .command(cfg.command)
      .description(cfg.description)
      .aliases(cfg.aliases ?? [])
      .action(cfg.action)
  );

  logger.dev(`Added command: ${cfg.command}`);
}

program.showHelpAfterError().showSuggestionAfterError().parse(process.argv);
