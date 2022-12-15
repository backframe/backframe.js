import type { BfServer } from "@backframe/rest";
import {
  debug,
  loadModule,
  logger,
  resolveCwd,
  resolvePackage,
} from "@backframe/utils";
import chokidar from "chokidar";
import { spawn } from "cross-spawn";
import { defineBfCommand } from "./index.js";

export default defineBfCommand({
  command: "serve",
  description: "Serve local backframe project",
  builder: (_) => {
    _.option("port", {
      alias: "p",
      default: 6969,
      description: "The port to start the server on",
    })
      .option("watch", {
        alias: "w",
        boolean: true,
        description: "Start the server in watch mode",
      })
      .option("open", {
        alias: "o",
        boolean: true,
        description: "Launch admin dashboard(if present)",
      });
  },
  handler: async (_args) => {
    const server = await getServer();

    if (_args["watch"]) {
      const watcher = chokidar.watch(["src/"], {
        ignored: ["node_modules/", ".bf/"],
      });

      watcher.on("ready", () => {
        logger.debug("watching for file changes...");
        watcher.on("all", () => {
          logger.debug("changes detected, restarting server... \n\n");
          server._handle?.close(async () => {
            await watcher.close();

            const args = process.argv.slice(2);
            spawn(resolveCwd("node_modules/.bin/bf"), args, {
              env: process.env,
              stdio: "inherit",
            });
          });
        });
      });
    }

    server.start(Number(_args["port"]));
  },
});

async function getServer() {
  try {
    const core = await resolvePackage("@backframe/core");
    const config = await core.default();

    const root = config.getRootDirName();
    const entry = config.getEntryPointName();

    const file = await loadModule(resolveCwd(root, entry));
    if (!file.default) {
      logger.error(`expected a default export from ${entry}`);
      process.exit(1);
    }

    const server: BfServer = file.default;
    await server.__init(config);

    return server;
  } catch (error) {
    debug(error as string);
    logger.error("an error occurred while trying to start the server");
    logger.error("please make sure you have installed @backframe/core");
    process.exit(1);
  }
}
