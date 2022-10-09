import loadCfg, { IBfServer } from "@backframe/core";
import { logger } from "@backframe/utils";
import chokidar from "chokidar";
import path from "path";

const current = (...s: string[]) => path.join(process.cwd(), ...s);
const load = async (s: string) => await import(`file://${s}`);

export default async function serve() {
  let app: IBfServer;

  const start = async () => {
    const pkgPath = resolvePackagePath("@backframe/rest");
    const module = await load(`${pkgPath}/dist/index.js`);
    const config = await loadCfg();
    app = await module.default(config);
  };

  await start();
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
      start();
    });
  };
}

function resolvePackagePath(name: string) {
  return current("node_modules", name);
}
