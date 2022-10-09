import loadCfg, { IBfServer } from "@backframe/core";
import path from "path";

const current = (...s: string[]) => path.join(process.cwd(), ...s);
const load = async (s: string) => await import(`file://${s}`);

export default async function serve() {
  const pkgPath = resolvePackagePath("@backframe/rest");
  const module = await load(`${pkgPath}/dist/index.js`);
  const config = await loadCfg();
  const app: IBfServer = await module.default(config);

  return app;
}

function resolvePackagePath(name: string) {
  return current("node_modules", name);
}
