import yargs from "yargs";
import add from "./commands/add";
import _new from "./commands/new";
import rest from "./commands/rest";
import serve from "./commands/serve";

export function buildCommands(cli: yargs.Argv) {
  // preserve order: commands without args first
  return [rest, serve, add, _new].forEach((c) =>
    cli.command(c.command, c.description, c.builder, c.handler)
  );
}
