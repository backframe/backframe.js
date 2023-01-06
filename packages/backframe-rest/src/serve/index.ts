import { BfConfig } from "@backframe/core";
import { DB } from "@backframe/models";
import { loadModule, logger } from "@backframe/utils";
import { BfServer } from "../app/index.js";

const argv = process.argv.slice(2);

export async function startServer(
  config: BfConfig,
  port = +argv[0] ?? process.env.PORT ? +process.env.PORT : undefined
) {
  const entry = config.getAbsDirPath("entryPoint");

  const file = await loadModule(entry);
  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: BfServer<DB> = file.default;
  await server.$init(config);

  server.$start(port ?? undefined);
}
