import program from "commander";
import chalk from "chalk";

program.version("1.0.0").description("The official backframe cli");

program
  .command("new <app-name>")
  .alias("n")
  .description("Creates a new backframe project in the specified directory")
  .option("-p, --preset <presetPath>", "Pass the path to custom bfconfig.json")
  .option("-d, --default", "Skip prompts and use default preset")
  .option("-g, --git ", "Initialize the project with git")
  .option("-n, --no-git", "Skip git initialization")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((appName, cmd) => {
    require("../commands/new").create(appName, cmd);
  });

program
  .command("serve")
  .alias("s")
  .option(
    "-p, --port <portNumber>",
    "Pass the custom port number to start the server on"
  )
  .option(
    "-o, --open",
    "Open the backframe admin dashboard in a browser window, default is false"
  )
  .description(
    "Starts the backframe server present in the working directory on port 9000 or a custom specified port"
  )
  .action((args, cmd) => {
    const PORT = args.port || 9000;
    console.log(
      `${chalk.green.bold(`🚀 Starting the server on port: ${PORT}....`)}`
    );
  });

program
  .command("build")
  .alias("b")
  .option("-q --quiet", "Skip the prompts and build the server directly")
  .option("-p --purge", "Build the server and remove every trace of backframe")
  .description(
    "Builds a fresh instance of a server, using confgurations found in the backframe.json file"
  );

program
  .command("watch")
  .alias("w")
  .option(
    "-p, --port <portNumber>",
    "Pass the custom port number to start the server on"
  )
  .option(
    "-e, --exclude [files]",
    "Pass a list of files not to watch for changes"
  )
  .description(
    "Starts the backframe server in watch mode, restarting whenever changes are detected"
  )
  .action((args, cmd) => {
    console.log(args);
  });

program
  .command("add <type> <package-name> [pluginOptions]")
  .alias("a")
  .allowUnknownOption()
  .description(
    "Installs and invokes a plugin/middleware to an existing server using bf-cli"
  )
  .action((type, pkgName, cmd) => {
    require("../commands/add")(type, pkgName, cmd);
  });

program
  .command("deploy [deployOptions]")
  .alias("d")
  .allowUnknownOption()
  .description(
    "Deploys your server using the configuration passed in the backframe.json file"
  )
  .action((args, cmd) => {
    console.log(args);
  });

program
  .command("generate <api-type>")
  .alias("g")
  .option("-v --version", "Specifies whether to version the api endpoints")
  .description(
    "Uses the cli to generate new api endpoints by prompting for values"
  )
  .action((args, cmd) => {
    require("../commands/generate").generate(args, cmd);
  });

program.on("--help", () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `bf <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach((c) => c.on("--help", () => console.log()));

program.arguments("<command>").action((cmd) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  // suggestCommands(cmd);
});

export async function start(rawArgs) {
  const { enhanceErrorMessages } = require("../lib/util/handleErrors");

  enhanceErrorMessages("missingArgument", (argName) => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`;
  });

  enhanceErrorMessages("unknownOption", (optionName) => {
    return `Unknown option ${chalk.yellow(optionName)}.`;
  });

  enhanceErrorMessages("optionMissingArgument", (option, flag) => {
    return (
      `Missing required argument for option ${chalk.yellow(option.flags)}` +
      (flag ? `, got ${chalk.yellow(flag)}` : ``)
    );
  });

  program.parse(rawArgs);
}
