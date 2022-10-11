#!/usr/bin/env node
import { program } from "commander";
import { serve } from "./cmd/serve.js";
import { watch } from "./cmd/watch.js";

program
  .name("bf-js")
  .version("0.0.0")
  .description(
    "A framework for rapid development and deployment of APIs/backends"
  );

program
  .command("serve")
  .alias("s")
  .description("Serve the project in the current working directory")
  .action(() => {
    serve();
  });

program
  .command("watch")
  .alias("w")
  .description("Start the backframe project in watch mode")
  .action(() => {
    watch();
  });

program.parse();
