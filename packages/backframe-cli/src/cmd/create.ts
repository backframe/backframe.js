import { resolveCwd } from "@backframe/utils";
import chalk from "chalk";
import fs from "fs-extra";
import _prompts from "prompts";
import { getPrompts } from "../lib/prompts";

const prompts = async (
  questions: _prompts.PromptObject<string> | _prompts.PromptObject<string>[]
) => await _prompts(questions, { onCancel: () => process.exit(1) });

export async function create(
  projectName: string,
  options: any = {}
): Promise<any> {
  if (!projectName) {
    const { appName } = await prompts({
      name: "appName",
      type: "text",
      initial: "server",
      message: "What should we call your new backframe project?",
    });
    projectName = appName;
  }

  const current = projectName === ".";
  const targetDir = resolveCwd(projectName);

  // TODO: Validate project name install: @validate-npm-package-name
  if (fs.existsSync(targetDir)) {
    if (options.force) fs.rmSync(targetDir, { recursive: true, force: true });
    else {
      if (current) {
        const { inCurrent } = await prompts({
          name: "inCurrent",
          type: "confirm",
          initial: false,
          message: `Generate project in current directory: ${chalk.blue.bold(
            targetDir
          )}`,
        });
        if (!inCurrent) return;
      } else {
        const { action } = await prompts({
          type: "select",
          message: `Target dir ${projectName} already exists. Pick an action:`,
          name: "action",
          choices: [
            { title: "Overwrite existing directory", value: "overwrite" },
            { title: "Enter a different name", value: "changeName" },
            { title: "Cancel", value: "cancel" },
          ],
        });

        if (!action) return;
        else if (action === "overwrite")
          fs.rmSync(targetDir, { recursive: true, force: true });
        else if (action === "changeName") {
          const { appName } = await prompts({
            name: "appName",
            type: "text",
            message: "Enter a new name for your project:",
          });
          return create(appName, options);
        }
      }
    }
  }

  fs.mkdirSync(targetDir);
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
        title: "Choose from preconfigured stacks/templates",
        value: "stacks",
      },
      {
        title: "Manually select features",
        value: "select",
      },
    ],
  });

  if (track === "minimal") {
    await minimalApp();
    return;
  }

  const questions = getPrompts(track);
  const answers = await prompts(questions);
  console.log(answers);
}

async function minimalApp() {}
