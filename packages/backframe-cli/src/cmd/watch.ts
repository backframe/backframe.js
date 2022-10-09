import { logger } from "@backframe/utils";
import chokidar from "chokidar";
import serve from "./serve.js";

export default async function () {
  const app = await serve();
  const watcher = chokidar.watch(["src", "bf.config.js"], {
    persistent: false,
  });

  watcher.on("ready", () => {
    logger.info("watching for file changes...");

    watcher.on("all", () => {
      logger.warn("changes detected, restarting server...");
      restart();
    });
  });

  const restart = () => {
    app.stop(() => {
      serve();
    });
  };
}
