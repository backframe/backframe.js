import consola from "consola";
import minimist from "minimist";
import prompts from "prompts";
import { create } from "./lib/create";
import { IConfig, showFiglet } from "./lib/utils";
import { resolvePrompts } from "./prompts";

const defaultCfg = {
  projectName: "backframe-app",
  languageVariant: "ts",
};

type Argv = string[] | { [key: string]: string };

async function _main(_argv: Argv) {
  showFiglet();
  consola.wrapConsole();

  let args;
  if (Array.isArray(_argv)) {
    // Args passed from bin target
    args = minimist(_argv as string[], {
      string: ["_"],
    });
  } else {
    // Args passed from bf cli
    args = _argv as minimist.ParsedArgs;
  }

  const argTargetDir = args._[0]?.trim().replace(/\/+$/g, "");
  const targetDir = argTargetDir || defaultCfg.projectName;

  const questions = resolvePrompts({
    argTargetDir,
    defaultCfg,
    targetDir,
    options: args,
  });

  // TODO: Check for skip prompts in args
  const results = (await prompts(questions, {
    onCancel: () => {
      consola.error("❌ Operation was cancelled");
      process.exit(1);
    },
  })) as IConfig;

  results.projectName = argTargetDir || results.projectName; // if passed as arg, use that
  results.targetDir = results.projectName;

  await create(results);
}

process.on("unhandledRejection", (err) =>
  consola.error("[unhandledRejection]", err)
);
process.on("uncaughtException", (err) =>
  consola.error("[uncaughtException]", err)
);

export function main(args: Argv) {
  _main(args).catch((error) => {
    consola.error(error);
    process.exit(1);
  });
}
