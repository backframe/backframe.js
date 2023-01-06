import * as tsr from "tsconfig-resolver";

export function loadTsConfig() {
  let tsconfig: tsr.TsConfigJson = {
    exclude: ["node_modules/", "dist/", ".bf/"],
    compilerOptions: {
      moduleResolution: "node",
      allowJs: true,
    },
  };

  // try find a custom tsconfig
  const config = tsr.tsconfigResolverSync({
    cache: true,
    ignoreExtends: true,
  });

  if (config.exists) tsconfig = config.config;

  // try find a jsconfig
  if (config.reason === "not-found") {
    const cfg = tsr.tsconfigResolverSync({
      cache: true,
      searchName: "jsconfig.json",
    });

    cfg.exists && (tsconfig = cfg.config);
  }

  return tsconfig;
}
