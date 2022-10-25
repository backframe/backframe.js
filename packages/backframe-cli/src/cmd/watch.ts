import { logger } from "@backframe/utils";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import chokidar from "chokidar";
import path from "path";

export async function watch() {
  let child: ChildProcessWithoutNullStreams;
  const current = (...s: string[]) => path.join(process.cwd(), ...s);

  const start = () => {
    child = spawn("sh", [current("./node_modules/.bin/bf"), "serve"]);
    child.stdout.pipe(process.stdout);
  };

  const watcher = chokidar.watch(["src", "bf.config.js", "bf.config.mjs"], {
    persistent: false,
    ignoreInitial: true,
  });

  watcher.on("ready", () => {
    logger.info("watching for file changes...");

    watcher.on("all", () => {
      logger.warn("changes detected, restarting server...");
      child.kill("SIGHUP");
      start();
    });
  });

  start();
}
