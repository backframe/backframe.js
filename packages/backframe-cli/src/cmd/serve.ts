import loadCfg from "@backframe/core";
import path from "path";

export default async function serve() {
  const config = await loadCfg();
  const pkgPath = resolvePackagePath("@backframe/rest");
  console.log(pkgPath);
  const module = await import(`file://${pkgPath}/dist/index.js`);
  module.default(config);
}

function resolvePackagePath(name: string) {
  return path.join(process.cwd(), "node_modules", name);
}
