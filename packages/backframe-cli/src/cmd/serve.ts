import loadCfg, { IBfServer } from "@backframe/core";
import { logger, resolvePackage } from "@backframe/utils";
import fs from "fs";
import path from "path";

const current = (...s: string[]) => path.join(process.cwd(), ...s);
const load = async (s: string) => await import(`${s}`);

export async function serve() {
  const cfg = await loadCfg();
  let server: IBfServer;
  // search if there is a custom server file
  const src = cfg.getFileSource();
  const file = path.join(src, "server.js");

  if (fs.existsSync(file)) {
    const module = await load(current(file));
    if (!Object.keys(module.default).length) {
      logger.error(`please export a default object from \`${"server.js"}\``);
      process.exit(1);
    }
    server = module.default;
  } else {
    const pkg = resolvePackage("@backframe/rest");
    server = pkg.defaultServer();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server._initialize(cfg);
  server.start();
  return server;
}
