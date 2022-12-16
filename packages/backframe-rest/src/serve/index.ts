import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import { BfServer } from "../app/index.js";

export async function startServer(config: BfConfig, port?: number) {
  const root = config.getRootDirName();
  const entry = config.getEntryPointName();

  const file = await loadModule(resolveCwd(root, entry));
  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: BfServer = file.default;
  await server.__init(config);

  server.start(port);
}
