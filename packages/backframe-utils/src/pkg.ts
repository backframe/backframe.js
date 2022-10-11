/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";

export function resolvePackage(name: string) {
  const current = (...s: string[]) =>
    path.join(process.cwd(), "node_modules", ...s);
  const pkg = require(current(name, "package.json"));
  const main = pkg.main;
  const module = require(current(name, main));
  return module;
}
