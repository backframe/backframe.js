#!/usr/bin/env node
import { program } from "commander";
import { create } from "./cmd/create";

program
  .name("bf")
  .version("0.0.0")
  .description(
    "A framework for rapid development and deployment of APIs/backends"
  );

program
  .command("serve")
  .alias("s")
  .description("Serve the project in the current working directory")
  .option(
    "-p, --port <portNumber>",
    "Pass the custom port number to start the server on"
  )
  .option(
    "-o, --open",
    "Open the backframe admin dashboard in a browser window, default is false"
  )
  .description("Starts the backframe server present in the working directory");
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
  .argument("[app-name]", "The name of the new project")
  .option("-d, --default", "Skip prompts and use default values")
  .option("-g, --git ", "Initialize the project with git")
  .option("-n, --no-git", "Skip git initialization")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("-t, --typescript", "Set the project up with typescript")
  .option(
    "-s, --stack <stack-name>",
    "Initialize project with preconfigured stack/preset"
  )
  .action(create);

program.parse();
