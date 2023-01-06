import { logger, resolveCwd } from "@backframe/utils";
import { ChildProcess } from "child_process";
import chokidar from "chokidar";
import { spawn } from "cross-spawn";
import { existsSync } from "fs";
import { globbySync } from "globby";
import { ensureBfProject } from "../util.js";
import { defineBfCommand } from "./index.js";

export default defineBfCommand({
  command: "serve",
  description: "Serve local backframe project in dev mode",
  builder: (_) => {
    _.option("port", {
      alias: "p",
      number: true,
      description: "The port to start the dev server on",
    });
  },
  handler: async (_args) => {
    try {
      ensureBfProject();

      let child: ChildProcess;
      if (!existsSync(resolveCwd("bin/serve.mjs"))) {
        logger.error("could not find bin target: `bin/serve.mjs`");
        logger.error("please make sure the file exists and try again");
        process.exit(10);
      }

      const start = () =>
        spawn("node", [resolveCwd("bin/serve.mjs"), _args["port"] as string], {
          stdio: "inherit",
        })
          .on("spawn", () => {
            setupWatcher();
          })
          .on("exit", (code, signal) => {
            if (code !== 0 && signal !== "SIGTERM")
              // not caused by child.kill()
              logger.error(
                "server crashed, waiting for changes before restarting..."
              );
          });

      const setupWatcher = () => {
        const watcher = chokidar.watch(["src/", ...globbySync("bf.config.*")], {
          ignored: ["node_modules", ".bf/", ...globbySync("./.*")],
        });

        watcher.on("ready", () => {
          logger.debug("watching for file changes...");

          watcher.on("all", async () => {
            logger.debug("changes detected, restarting server...");

            await watcher.close();
            child.kill();
            child = start();
          });
        });
      };

      child = start();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error("an error occurred while trying to start the server");
      logger.error(
        "make sure you have installed @backframe/core and @backframe/rest"
      );
      process.exit(1);
    }
  },
});
