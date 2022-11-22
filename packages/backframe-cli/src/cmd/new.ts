import { resolveCwd } from "@backframe/utils";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";

export async function newApp(options: any) {
  // create new backframe app
  let dir = options.appName;
  let targetDir;

  if (!dir) {
    targetDir = await promptDir();
  } else if (dir === ".") {
    const { inCurrent } = await inquirer.prompt({
      type: "confirm",
      message: "Create project in current dir?",
      default: true,
      name: "inCurrent",
    });

    if (inCurrent) {
      targetDir = path.resolve(".");
    } else targetDir = await promptDir();
  }

  console.log(targetDir);
}

async function promptDir() {
  const { dir } = await inquirer.prompt({
    type: "input",
    message: "Enter the name of your new backframe project...",
    name: "dir",
    default: "server",
  });

  if (fs.existsSync(resolveCwd(dir))) {
    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      message: `Target dir ${dir} already exists. Overwrite it?`,
      name: "overwrite",
      default: true,
    });

    overwrite && fs.rmSync(resolveCwd(dir), { recursive: true, force: true });
  }

  fs.mkdirSync(resolveCwd(dir));
  return resolveCwd(dir);
}
