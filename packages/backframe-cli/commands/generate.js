import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const access = promisify(fs.access);

export async function generate(api, options) {
  const ctx = process.cwd();

  try {
    await access(path.join(ctx, "backframe.json"), fs.constants.R_OK);
  } catch (error) {
    console.log(
      chalk.red(
        `\nFatal: could not detect a ${chalk.yellow(
          `backframe.json`
        )} file in current directory. Are you in a backframe project?\n`
      )
    );
    return;
  }

  switch (api) {
    case "rest":
      console.log("rest");
      break;
    case "gql":
      console.log("gql");
      break;
    case "rpc":
      console.log("rpc");
      break;
    case "soap":
      console.log("soap");
      break;
    default:
      break;
  }
}
