#!/usr/bin/env node

import type { BfConfig } from "@backframe/core";
import {
  loadModule,
  logger,
  resolveCwd,
  resolvePackage,
} from "@backframe/utils";
import { BfServer } from "./app/index.js";

// load the already installed peerDep
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
server.start();
