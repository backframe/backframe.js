import { logger } from "@backframe/utils";
import g from "glob";
const { glob } = g;

export function ensureBfProject() {
  const cfgMatches = glob.sync("./bf.config.*");
  if (!(cfgMatches.length > 0)) {
    logger.error(
      "this command can only be run in a backframe project. no config file was found"
    );
    process.exit(1);
  }
}
