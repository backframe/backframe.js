import { BfConfig } from "@backframe/core";
import { loadModule, logger } from "@backframe/utils";
import { BfServer } from "../app/index.js";

export async function startServer(config: BfConfig, port?: number) {
  const entry = config.getEntryPoint();

  const file = await loadModule(entry);
  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: BfServer<unknown> = file.default;
  await server.__init(config);

  server.start(port);
}
