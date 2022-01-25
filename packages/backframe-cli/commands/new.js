import fs from "fs";
import ncp from "ncp";
import path from "path";
import execa from "execa";
import chalk from "chalk";
import Listr from "listr";
import inquirer from "inquirer";
import {promisify} from "util";
import validateProjectName from "validate-npm-package-name";

import {getPromptModules} from "../lib/util/promptModules";
import writeFiles from "../lib/util/writeFiles";
import {RestGenerator} from "@backframe/shared-utils";

const access = promisify(fs.access);
const copy = promisify(ncp);

export async function create(projectName, options) {
  // console.log(options);
  if (!projectName) {
    const {appName} = await inquirer.prompt([
      {
        name: "appName",
        type: "input",
        message: `What name would you like to use for your new backframe project?`,
      },
    ]);
    projectName = appName;
  }

  // Set git to be true by default
  options = {
    ...options,
    git: true,
  };
  const directory = options.cwd || process.cwd();
  const current = projectName === ".";
  const name = current ? path.relative("../", directory) : projectName;
  const targetDir = path.join(directory, projectName || ".");

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.yellow("Error: " + err));
      });
    result.warnings &&
      result.warnings.forEach(warn => {
        console.error(chalk.yellow("Warning: " + warn));
      });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      fs.rm(targetDir, {recursive: true, force: true});
    } else {
      if (current) {
        const {inCurrent} = await inquirer.prompt([
          {
            name: "inCurrent",
            type: "confirm",
            message: `Generate project in current directory: ${chalk.blue.bold(
              targetDir,
            )}`,
          },
        ]);

        if (!inCurrent) return;
      } else {
        const {action} = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${chalk.blue.bold(
              targetDir,
            )} already exists. Pick an action:`,
            choices: [
              {name: "Overwrite existing directory", value: "overwrite"},
              {name: "Enter a different name", value: "changeName"},
              {name: "Cancel", value: false},
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\n${chalk.green.dim(`Removing ${targetDir}...`)}\n`);
          fs.rmSync(targetDir, {recursive: true, force: true});
        } else if (action === "changeName") {
          const {appName} = await inquirer.prompt({
            type: "input",
            name: "appName",
            message: "Enter a new name for your project:",
          });
          return create(appName, options);
        }
      }
    }
  }

  let cfg;

  if (options.default) {
    cfg = {
      apis: "rest",
      database: "mongodb",
      "auth-providers": "email-local",
      internals: "analytics",
    };
  } else if (options.preset) {
    try {
      await access(options.preset, fs.constants.R_OK);
    } catch (e) {
      console.log(
        `${chalk.red(
          `An error occurred when trying to load preset: ${chalk.yellow(
            options.preset,
          )}`,
        )}`,
      );
      console.log(e.message);
      return;
    }
    cfg = JSON.parse(fs.readFileSync(options.preset).toString());
  } else {
    cfg = await resolvePrompts();
  }

  // Save bfconfig.json file
  if (cfg.SavePreset) {
    delete cfg.SavePreset;
    writeFiles(targetDir, {"bfconfig.json": JSON.stringify(cfg, null, 2)});
  }

  // TODO: write a util file for checking git, package manager etc to decide which pkg mngr to use
  // TODO: Create the backframe deps and publish them to get started
  // TODO: Install the required packages and run cmpletion hooks

  // Start execution of the tasks
  const tasks = new Listr([
    {
      title: `🌟 Creating a new project in ${chalk.green.bold(targetDir)}`,
      task: () => initializeProject(name, targetDir, options, cfg),
    },
    {
      title: `🗃  Initializing  git repository...`,
      task: () => initGit(targetDir),
      enabled: () => options.git,
    },
    // {
    //   title: `📲  Invoking Generators...`,
    //   task: () => invokeGenerators(targetDir),
    // },
  ]);

  await tasks.run();

  console.log();
  console.log(`🎉  Successfully created project ${chalk.yellow(targetDir)}.\n`);
  console.log(
    `👉  Get started with the following commands:\n\n` +
      (targetDir === process.cwd()
        ? ``
        : chalk.cyan(` ${chalk.gray("$")} cd ${projectName}\n`)) +
      chalk.cyan(` ${chalk.gray("$")} ${"bf serve"}`),
  );

  // Some little humour
  console.log(
    `\n${chalk.cyan.bold(
      `Now you can build your API without going insane 😁. Happy Hacking!`,
    )}`,
  );

  return true;
}

async function resolvePrompts() {
  const questions = [];

  const modules = getPromptModules();
  modules.forEach(m => {
    // FIXME: Implement a better way to check if the return value is an array
    if (m().length) questions.push(...m());
    else questions.push(m());
  });

  const answers = await inquirer.prompt(questions);
  return answers;
}

function resolveDependencies(options) {
  const schema = require("../models/deps.json");

  let deps = [];
  let devDeps = [];

  deps.push(...schema["backframe"]["deps"]);
  const features = Array.from(Object.keys(options));

  features.forEach(feat => {
    if (typeof options[feat] === "string") {
      const value = options[feat];
      getDeps(schema, feat, value);
    } else {
      for (const value of Array.from(options[feat])) {
        getDeps(schema, feat, value);
      }
    }
  });

  function getDeps(schema, feat, value) {
    const obj = schema[feat][value];
    if (obj) {
      if (obj["deps"]) deps.push(...obj["deps"]);
      if (obj["devDeps"]) devDeps.push(...obj["devDeps"]);
    }
  }

  return [deps, devDeps];
}

async function initializeProject(name, dest, ctx, preset) {
  // Features entered manually
  const [deps, devDeps] = resolveDependencies(preset);

  const pkg = {
    name,
    version: "0.1.0",
    private: true,
    dependencies: {},
    devDependencies: {},
  };

  deps.forEach(dep => {
    const version = dep.version || "latest";
    const name = dep.name;

    pkg.dependencies[name] = version;
  });

  devDeps.forEach(dep => {
    const version = dep.version || "latest";
    const name = dep.name;

    pkg.devDependencies[name] = version;
  });
  // Write package.json
  writeFiles(dest, {
    "package.json": JSON.stringify(pkg, null, 2),
  });

  const bfconfig = {
    language: "js",
    apis: [...preset.apis],
    middleware: {},
    endpoints: {},
    database: {db: preset.database, development: preset.internals.mockdb},
    auth: {},
    thirdPartyServices: {},
  };

  bfconfig.apis.forEach(a => (bfconfig.endpoints[a] = {}));
  bfconfig.auth["strategies"] = preset["auth-providers"].map(p => ({
    provider: p,
    options: {},
  }));
  bfconfig.thirdPartyServices = preset["third-party"].map(s => ({
    service: s,
    options: {},
  }));

  // write backframe.json
  writeFiles(dest, {
    "backframe.json": JSON.stringify(bfconfig, null, 2),
  });
}

async function initGit(targetDirectory) {
  const result = await execa("git", ["init"], {
    cwd: targetDirectory,
  });

  if (result.failed) {
    console.log(`${chalk.yellow(`Failed to initiliaze git repository!`)}`);
  }
}
