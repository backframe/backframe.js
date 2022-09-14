#!/usr/bin/env node
import { program } from "commander";
import serve from "./cmd/serve.js";

program
  .name("bf")
  .version("0.1.0")
  .description(
    "A framework for rapid development and deployment of APIs/backends"
  );

program
  .command("serve")
  .description("Serve local bf project")
  .action(() => {
    serve();
  });

program.parse();
