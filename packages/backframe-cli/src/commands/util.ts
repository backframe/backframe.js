import { Command } from "commander";

export interface ICommandConfig {
  command: string;
  description: string;
  aliases?: string[];
  builder?: (cmd: Command) => Command;
  action?: (...args: unknown[]) => void;
}

export function defineBfCommand(opts: ICommandConfig) {
  return opts;
}
