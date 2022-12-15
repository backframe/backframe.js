import type { BfConfig } from "@backframe/core";
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
import { globbySync } from "globby";
import { defineBfCommand } from "./index.js";

const respawn = () =>
  spawn(resolveCwd("node_modules/.bin/bf"), process.argv.slice(2), {
    env: process.env,
    stdio: "inherit",
  });

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
    try {
      // TODO: validate in core that values specified in cfg exist
      const core = await resolvePackage("@backframe/core");
      const config: BfConfig = await core.default();

      const root = config.getRootDirName();
      const entry = config.getEntryPointName();

      const file = await loadModule(resolveCwd(root, entry));
      if (!file.default) {
        logger.error(`expected a default export from ${entry}`);
        process.exit(1);
      }

      const server: BfServer = file.default;
      await server.__init(config);

      if (_args["watch"]) {
        // get sources
        const toWatch = () => {
          const files = [config.userCfg.root!];
          const m = globbySync("./bf.config.*");
          m.length && files.push(m[0]);
          return files;
        };

        const watcher = chokidar.watch([...toWatch()], {
          ignored: ["node_modules/", ".bf/"],
        });

        watcher.on("ready", () => {
          logger.debug("watching for file changes...");

          watcher.on("all", () => {
            logger.debug("changes detected, restarting server...");

            server._handle?.close(async () => {
              await watcher.close();
              respawn();
            });
          });
        });
      }

      server.start(Number(_args["port"]));
    } catch (error) {
      debug(error as string);
      logger.error("an error occurred while trying to start the server");
      logger.error(
        "make sure you have installed @backframe/core and @backframe/rest"
      );
      process.exit(1);
    }
  },
});

// TODO: listen for exits
