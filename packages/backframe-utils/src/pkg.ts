import fs from "fs";
/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";

export function resolveCwd(...s: string[]) {
  return path.join(process.cwd(), ...s);
}

export async function loadModule(s: string) {
  return await import(`file://${s}`);
}

export async function resolvePackage(s: string) {
  const p = resolveCwd("node_modules", s, "package.json");
  const pkg = JSON.parse(fs.readFileSync(p, "utf-8"));
  const module = await loadModule(resolveCwd("node_modules", s, pkg.main));
  return module;
}
