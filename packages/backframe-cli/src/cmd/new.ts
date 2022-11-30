import { resolveCwd } from "@backframe/utils";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";

export async function createApp(dir: string, options: any) {
  // create new backframe app
  let targetDir;

  if (!dir) {
    targetDir = await promptDir(options);
  } else if (dir === ".") {
    const { inCurrent } = await prompts({
      type: "confirm",
      message: `Create project in current dir? ${chalk.dim(
        "(This will overwrite it)"
      )}`,
      initial: true,
      name: "inCurrent",
    });

    if (inCurrent) {
      fs.rmSync(path.resolve("."), { recursive: true, force: true });
      targetDir = path.resolve(".");
    } else targetDir = await promptDir();
  }

  // console.log(chalk.cyan(`Using ${targetDir}`));

  // Start prompts
  if (!options.skipPrompts) {
    await startPrompts(dir, options);
  } else {
    // create default app
  }
}

async function promptDir(options: any = {}) {
  const { dir } = await prompts({
    type: "text",
    message: "Enter the name of your new backframe project...",
    name: "dir",
    initial: "server",
  });

  if (fs.existsSync(resolveCwd(dir))) {
    const rm = () => {
      fs.rmSync(resolveCwd(dir), { recursive: true, force: true });
    };
    if (options.force) {
      rm();
    } else {
      const { action } = await prompts({
        type: "select",
        message: `Target dir ${dir} already exists. Pick an action:`,
        name: "action",
        choices: [
          { title: "Overwrite existing directory", value: "overwrite" },
          { title: "Enter a different name", value: "changeName" },
          { title: "Cancel", value: "cancel" },
        ],
      });
      if (!action) return;
      else if (action === "overwrite") rm();
      else if (action === "changeName") {
        const { appName } = await prompts({
          name: "appName",
          type: "text",
          message: "Enter a new name for your project:",
        });
        return createApp(appName, options);
      }
    }
  }

  fs.mkdirSync(resolveCwd(dir));
  return resolveCwd(dir);
}

async function startPrompts(dir: string, options: any = {}) {
  const appConfig = {
    template: "",
    actions: [],
  };

  const { track } = await prompts({
    type: "select",
    name: "track",
    message: "How would you like to proceed?",
    choices: [
      {
        title: "Create minimal starter app",
        value: "minimal",
      },
      {
        title: "Choose from preconfigured stacks",
        value: "stacks",
      },
      {
        title: "Manually select features",
        value: "select",
      },
    ],
  });

  if (track === "minimal") {
    // create minimal app
  } else if (track === "stacks") {
    // get stacks/templates
  } else {
    const apiPrompt = async () => {
      const { api } = await prompts({
        type: "multiselect",
        name: "api",
        message: "What type of API(s) would you like to implement?",
        choices: [
          { title: "REST", value: "rest" },
          { title: "GraphQL", value: "gql" },
        ],
        instructions: `Press ${chalk.cyan("<space>")} to select, ${chalk.cyan(
          "<enter>"
        )} to proceed`,
      });
      return api;
    };

    const dbPrompt = async () => {
      const { db } = await prompts({
        name: "db",
        type: "select",
        message: "Select a database",
        choices: [
          { title: "Postgres", value: "pg" },
          { title: "MongoDB", value: "mongo" },
          { title: "MySQL", value: "mysql" },
          { title: "SQLite", value: "sqlite" },
          { title: "Redis", value: "redis" },
        ],
      });
      return db;
    };

    await apiPrompt();

    await dbPrompt();
  }
}
