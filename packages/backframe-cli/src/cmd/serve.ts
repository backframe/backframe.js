import loadCfg from "@backframe/core";
import { resolvePackage } from "@backframe/utils";
import { ensureBfProject } from "../lib/utils";

export async function serve(options: any) {
  ensureBfProject();
  const cfg = await loadCfg();
  let server;

  if (cfg.getServer()) {
    server = cfg.getServer();
  } else {
    const pkg = resolvePackage("@backframe/rest");
    server = pkg.defaultServer();
  }

  server._initialize(cfg);
  server.start(options.port);
}
