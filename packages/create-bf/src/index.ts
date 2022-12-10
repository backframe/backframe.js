import consola from "consola";
import minimist from "minimist";
import prompts from "prompts";
import { resolvePrompts } from "./prompts";

const defaultCfg = {
  projectName: "backframe-app",
  languageVariant: "ts",
};

async function _main() {
  const _argv = process.argv.slice(2);
  const args = minimist(_argv, {
    boolean: true,
    string: ["_"],
  });

  const argTargetDir = args._[0]?.trim().replace(/\/+$/g, "");
  const targetDir = argTargetDir || defaultCfg.projectName;

  const questions = resolvePrompts({
    argTargetDir,
    defaultCfg,
    targetDir,
  });

  await prompts(questions);
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
