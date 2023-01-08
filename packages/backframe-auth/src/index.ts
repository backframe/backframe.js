/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Plugin } from "@backframe/core";
import { require } from "@backframe/utils";
import merge from "lodash.merge";
import path from "path";
import { fileURLToPath } from "url";
import { Provider } from "./lib/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require(path.join(__dirname, "../package.json"));

export interface AuthConfig {
  prefix?: string;
  encode?: (payload: string, options?: unknown) => string;
  decode?: <T extends { payload: string }>(
    token: string,
    options?: unknown
  ) => T;
  hash?: (
    data: string | Buffer,
    options?: unknown
  ) => string | PromiseLike<string>;
  compare?: (
    data: string | Buffer,
    encrypted: string
  ) => boolean | PromiseLike<boolean>;
}

export const DEFAULT_CFG: AuthConfig = {
  prefix: "/auth",
};

export default function (cfg = DEFAULT_CFG): Plugin {
  cfg = merge(DEFAULT_CFG, cfg);
  return {
    name: pkg.name,
    description:
      pkg.description || "Provides authentication for a backframe app",
    version: pkg.version || "0.0.0",
    onServerInit(bfCfg) {
      const { $server } = bfCfg;
      const { $app } = bfCfg.$server;
      const providers = bfCfg.getConfig("authentication")
        .providers as Provider[];

      $app.use(bfCfg.withRestPrefix(cfg.prefix), (rq, _rs, nxt) => {
        // @ts-expect-error - it will be there
        rq.authCfg = cfg;
        nxt();
      });

      const ignored = [];
      const credentials = providers.find((p) => p.id === "credentials");
      if (!credentials) {
        ignored.push("register.js");
      }

      // mount auth pkg routes
      $server.$extendFrom(__dirname, {
        name: pkg.name,
        prefix: cfg.prefix,
        ignored,
      });
    },
  };
}
