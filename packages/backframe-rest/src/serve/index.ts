import { BfConfig } from "@backframe/core";
import { loadModule, logger } from "@backframe/utils";
import { BfServer } from "../app/index.js";

const argv = process.argv.slice(2);

export async function startServer(
  config: BfConfig,
  port = process.env.PORT ? +process.env.PORT : undefined
) {
  if (argv[0] && argv[0] !== "undefined") {
    port = +argv[0];
  }

  const entry = config.getAbsDirPath("entryPoint");
  const file = await loadModule(entry);

  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: BfServer = file.default;
  await server.$init(config);

  server.$start(port ?? undefined);
}
