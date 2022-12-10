import fs from "fs";
import { cyan, green, yellow } from "kleur/colors";
import path from "path";
import { PromptObject } from "prompts";
import {
  IPromptFnArgs,
  MANUAL_TRACK,
  MINIMIST_TRACK,
  TEMPLATE_TRACK,
} from "./utils";

export const configPrompts = ({
  argTargetDir,
  targetDir,
  defaultCfg,
}: IPromptFnArgs): PromptObject[] => {
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  return [
    {
      type: () => (argTargetDir ? null : "text"),
      name: "projectName",
      message: "What should we call your new project?",
      initial: defaultCfg.projectName,
      onState: (state) => {
        targetDir = (formatTargetDir(state.value) ||
          defaultCfg.projectName) as string;
      },
    },
    {
      type: () =>
        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
      name: "overwrite",
      message: () =>
        `${
          targetDir === "."
            ? "Current directory"
            : `Target directory "${targetDir}"`
        } is not empty. Overwrite and continue?`,
    },
    {
      type: (_, { overwrite }: { overwrite?: boolean }) => {
        if (overwrite === false) {
          return "text";
        }
        return null;
      },
      name: "projectName",
      message: "Enter a different name for your project...",
      onState: (state) => {
        targetDir = state.value || defaultCfg.projectName;
      },
    },
    {
      type: () => (isValidPackageName(getProjectName()) ? null : "text"),
      name: "packageName",
      message: "Package name:",
      initial: () => toValidPackageName(getProjectName()),
      validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
    },
    {
      type: "select",
      message: "Choose a language variant:",
      choices: [
        { title: cyan("Typescript"), value: "ts" },
        { title: green("Javascript"), value: "js" },
      ],
      name: "languageVariant",
      onState(state) {
        defaultCfg.languageVariant = state.value;
      },
    },
    {
      type: "select",
      name: "track",
      message: "How would you like to proceed?",
      choices: [
        {
          title: cyan("Create minimal starter app"),
          value: MINIMIST_TRACK,
        },
        {
          title: green("Choose from preconfigured stacks/templates"),
          value: TEMPLATE_TRACK,
        },
        {
          title: yellow("Manually select features"),
          value: MANUAL_TRACK,
        },
      ],
    },
  ];
};

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}
