import { logger, resolveCwd } from "@backframe/utils";
import { ChildProcess } from "child_process";
import chokidar, { FSWatcher } from "chokidar";
import { spawn } from "cross-spawn";
import { existsSync } from "fs";
import { globbySync } from "globby";
import readline from "readline";
import { ensureBfProject } from "../util.js";
import { defineBfCommand } from "./index.js";

export default defineBfCommand({
  alias: "s",
  command: "serve",
  description: "Serve local backframe project in dev mode",
  builder: (_) => {
    _.option("port", {
      alias: "p",
      number: true,
      description: "The port to start the dev server on",
    })
      .option("host", {
        alias: "h",
        description: "The host address to start the server on",
      })
      .option("ignore", {
        alias: "i",
        description: "A array of paths to be ignored by the watcher",
        array: true,
        default: [],
      })
      .option("ext", {
        array: true,
        description: "File extensions to to include i watcher",
        default: [],
      })
      .option("watch", {
        array: true,
        alias: "w",
        description: "A list of paths to include in the watcher",
        default: [],
      });
  },
  handler: async (args) => {
    try {
      ensureBfProject();

      let rl: readline.Interface;
      let child: ChildProcess;
      let watcher: FSWatcher;

      if (!existsSync(resolveCwd("bin/serve.mjs"))) {
        logger.error("could not find bin target: `bin/serve.mjs`");
        logger.error("please make sure the file exists and try again");
        process.exit(10);
      }

      const start = () =>
        spawn("node", [resolveCwd("bin/serve.mjs"), args["port"] as string], {
          stdio: "inherit",
        })
          .on("spawn", () => {
            setupRL();
            setupWatcher();
          })
          .on("exit", (code, signal) => {
            if (code !== 0 && signal !== "SIGTERM")
              // not caused by child.kill()
              logger.error(
                "server crashed, waiting for changes before restarting..."
              );
          });

      const restart = async (msg: string) => {
        logger.debug(msg);
        rl?.close();
        await watcher.close();
        child.kill();
        child = start();
      };

      const toWatch = globbySync(
        `./**/*.{${[
          ...["js", "ts", "json", "mjs", "cjs"],
          ...(args["ext"] as string[]),
        ].join(",")}}`,
        {
          ignore: [
            ...["node_modules/", ".bf/"],
            ...(args["ignore"] as string[]),
          ],
        }
      );

      (args["watch"] as string[]).forEach((i) => toWatch.push(i));
      logger.dev(toWatch.join("\n"));

      const setupRL = () => {
        rl = readline.createInterface(process.stdin);
        rl.on("line", async (i) => {
          if (i.trim() === "rs") {
            rl.close();
            await restart("received `rs` signal, restarting...");
          }
        });
        rl.on("SIGINT", () => process.exit(0));
      };

      const setupWatcher = () => {
        watcher = chokidar.watch([...toWatch, ...globbySync("bf.config.*")], {
          ignored: ["node_modules", ".bf/", ...(args["ignore"] as string[])],
        });

        watcher.on("ready", () => {
          logger.debug("watching for file changes...");

          watcher.on("all", async () => {
            await restart("changes detected, restarting server...");
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
