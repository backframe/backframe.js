#!/usr/bin/env node
import { program } from "commander";

program
  .name("bf")
  .version("0.0.0")
  .description(
    "A framework for rapid development and deployment of APIs/backends"
  );

program
  .command("serve")
  .alias("s")
  .description("Serve the project in the current working directory");
// .action(serve);

program
  .command("watch")
  .alias("w")
  .description("Start the backframe project in watch mode");
// .action(require("./cmd/watch"));

program
  .command("new")
  .alias("n")
  .description("Create a new backframe project")
  .argument("[app-name]", "The name of the new project");
// .action(newApp);

program.parse();
