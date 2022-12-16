import fs from "fs";
import { createRequire } from "module";
/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import { fileURLToPath } from "url";

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

export function require(id: string) {
  const __filename = fileURLToPath(import.meta.url);
  const _require = createRequire(__filename);
  return _require(id);
}
