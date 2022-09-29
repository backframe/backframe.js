import loadCfg from "@backframe/core";
import path from "path";

export default async function serve() {
  const pkgPath = resolvePackagePath("@backframe/rest");
  console.log(pkgPath);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module = require(`${pkgPath}/dist/index.js`);
  const config = await loadCfg();
  module.default(config);
}

function resolvePackagePath(name: string) {
  return path.join(process.cwd(), "node_modules", name);
}
