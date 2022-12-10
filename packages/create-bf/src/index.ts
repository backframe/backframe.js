import consola from "consola";
import fs from "fs";
import { cyan, gray, green, reset, yellow } from "kleur";
import minimist from "minimist";
import path from "path";
import prompts from "prompts";

const defaultCfg = {
  projectName: "backframe-app",
  languageVariant: "ts",
};
// const cwd = process.cwd();
const instructions = gray(
  `Press ${cyan("<space>")} to select, ${cyan("<enter>")} to proceed`
);

async function _main() {
  const _argv = process.argv.slice(2);
  const args = minimist(_argv, {
    boolean: true,
    string: ["_"],
  });

  const argTargetDir = formatTargetDir(args._[0]);
  let targetDir = argTargetDir || defaultCfg.projectName;
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  const _answers = await prompts([
    {
      type: () => (argTargetDir ? null : "text"),
      name: "projectName",
      message: reset("What should we call your new project?"),
      initial: defaultCfg.projectName,
      onState: (state) => {
        targetDir = formatTargetDir(
          state.value || defaultCfg.projectName
        ) as string;
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
      message: reset("Enter a different name for your project..."),
      onState: (state) => {
        targetDir = state.value || defaultCfg.projectName;
      },
    },
    {
      type: () => (isValidPackageName(getProjectName()) ? null : "text"),
      name: "packageName",
      message: reset("Package name:"),
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
          value: "minimalStarter",
        },
        {
          title: green("Choose from preconfigured stacks/templates"),
          value: "templates",
        },
        {
          title: yellow("Manually select features"),
          value: "manually",
        },
      ],
      initial: 0,
    },
    {
      type: (_, { track }: { track: string }) => {
        if (track === "manually") return "multiselect";
        return null;
      },
      name: "apiTypes",
      message: "What type of API(s) would you like to implement?",
      choices: [
        { title: "REST", value: "rest" },
        { title: "GraphQL", value: "gql" },
      ],
      instructions,
    },
    {
      type: (_, { track }: { track: string }) => {
        if (track === "manually") return "select";
        return null;
      },
      name: "database",
      message: "Select a database...",
      choices: [
        { title: "Postgres", value: "postgres" },
        { title: "MongoDB", value: "mongodb" },
        { title: "MySQL", value: "mysql" },
        { title: "SQLite", value: "sqlite" },
        { title: "Redis", value: "redis" },
      ],
      initial: 0,
    },
    {
      type: (_, { track }: { track: string }) => {
        if (track === "manually") return "multiselect";
        return null;
      },
      name: "authProviders",
      message: "Select auth providers to integrate...",
      choices: [
        { title: "Google", value: "google" },
        { title: "Twitter", value: "twitter" },
        { title: "Github", value: "github" },
        { title: "Facebook", value: "facebook" },
        { title: "Email and password", value: "emailLocal" },
        { title: "Phone Number", value: "phoneNumber" },
      ],
      instructions,
    },
    {
      type: (
        _,
        { authProviders, track }: { authProviders?: string[]; track: string }
      ) => {
        if ((authProviders?.length || 0) > 0 && track === "manually")
          return "select";
        return null;
      },
      name: "authStrategy",
      choices: [
        { title: "JWT based", value: "jwt" },
        { title: "Session based", value: "sessions" },
      ],
      message: reset("Select an auth strategy:"),
      initial: 1,
    },
    {
      type: (_, { track }: { track: string }) => {
        if (track === "manually") return "multiselect";
        return null;
      },
      name: "additional",
      message: "Select additional server features:",
      choices: [
        { title: "Add a file storage provider", value: "storageProvider" },
        { title: "Configure an email provider", value: "emailProvider" },
        { title: "Enable web sockets", value: "sockets" },
        { title: "Configure server with pub-sub", value: "pubsub" },
        { title: "Install admin dashboard", value: "admin" },
        { title: "Install testing utilities", value: "testing" },
      ],
      instructions,
    },
    {
      type: (_, { additional }: { additional: { [key: string]: string } }) => {
        if (additional["storageProvider"]) return "select";
        return null;
      },
      name: "storageProvider",
      message: "Select a storage provider:",
      choices: [
        { title: "Local", value: "local" },
        { title: "AWS", value: "aws" },
        { title: "GCP", value: "gcp" },
        { title: "Azure", value: "azure" },
      ],
      initial: 0,
    },
    {
      type: (_, { additional }: { additional: { [key: string]: string } }) => {
        if (additional["emailProvider"]) return "select";
        return null;
      },
      name: "emailProvider",
      message: "Select an email provider",
      choices: [
        { title: "Node mailer", value: "mailer" },
        { title: "Sendgrid", value: "sendgrid" },
        { title: "Mailchimp", value: "mailchimp" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "deployTarget",
      message: "Where would you like to deploy(You can change this later)?",
      choices: [
        {
          title: "backframe.app(coming soon)",
          value: "backframe",
          disabled: true,
        },
        { title: "railway.app", value: "railway" },
        { title: "fly.io", value: "fly" },
        { title: "render.com", value: "render" },
        { title: "cyclic.sh", value: "cyclic" },
      ],
    },
    {
      type: "confirm",
      name: "installDeps",
      message: `Would you like to run ${"npm"} install?`,
      initial: true,
    },
  ]);

  return { targetDir, _answers };
}

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

consola.wrapConsole();

process.on("unhandledRejection", (err) =>
  consola.error("[unhandledRejection]", err)
);
process.on("uncaughtException", (err) =>
  consola.error("[uncaughtException]", err)
);

export function main() {
  _main().catch((error) => {
    consola.error(error);
    process.exit(1);
  });
}
