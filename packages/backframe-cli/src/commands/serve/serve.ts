import { logger, resolveCwd } from "@backframe/utils";
import { ChildProcess } from "child_process";
import chokidar, { FSWatcher } from "chokidar";
import spawn from "cross-spawn";
import { existsSync } from "fs";
import { cyan } from "kleur/colors";
import readline from "readline";
import { ensureBfProject } from "../../util";

export async function serve(args: Record<string, unknown>) {
  logger.dev(`running serve command with args: ${JSON.stringify(args)}`);
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

    const filterPaths = (paths: string[]) => {
      const filtered: string[] = [];
      for (const path of paths) {
        if (existsSync(path)) filtered.push(path);
        else
          logger.warn(
            `path ${cyan(`\`${path}\``)} does not exist, ignoring...`
          );
      }
      return filtered;
    };

    const setupWatcher = () => {
      watcher = chokidar.watch(
        [
          `./**/*.{${[
            ...["js", "ts", "json", "mjs", "cjs"],
            ...(args["ext"] as string[]),
          ].join(",")}}`,
          "bf.config.*",
          ...filterPaths(args["watch"] as string[]),
        ],
        {
          ignored: [
            "./node_modules",
            "./.bf/**/*",
            ...filterPaths(args["ignore"] as string[]),
          ],
        }
      );

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
}
