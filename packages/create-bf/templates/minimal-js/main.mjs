#!/usr/bin/env node

/* eslint-disable no-undef */
import loadConfig from "@backframe/core";
import path from "path";

const current = (...s) => {
  return path.join(process.cwd(), ...s);
};

const config = await loadConfig();
const root = config.getRootDirName();
const entry = config.getEntryPointName();

const file = await import(`file://${current(root, entry)}`);
if (!file.default) {
  console.log(`expected a default export from ${entry}`);
  process.exit(1);
}

const server = file.default;

await server.__init(config);
server.start();
