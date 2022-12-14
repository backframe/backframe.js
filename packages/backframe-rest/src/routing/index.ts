import { BfConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import { globbySync } from "globby";
import path from "path";
import { ManifestData } from "./manifest.js";

export interface Item {
  route: string;
  filePath: string;
  basename: string;
  dirname: string;
}

const std = /^([^\$]+).js$/;
const index = /^index.js$/;
const indexShadow = /^\(([^\)]+)\).js$/;
const dynamic = /^\$(\w+).js$/;
const multiPart = /^(?:(?:\w+|\$\w+).){2,}js$/;

export function getManifest(cfg: BfConfig) {
  const root = cfg.getRootDirName();
  const src = cfg.getRoutesDirName();
  const ptrn = `./${root}/${src}/**/*.js`;

  const matches = globbySync(ptrn);
  if (!matches.length) {
    logger.warn(`no routes detected in the ${src} directory`);
  }

  // TODO(maybe): sort the matches
  const prefix = cfg.getRestConfig().urlPrefix ?? "/";
  const routes = matches.map((m): Item => {
    let route;
    // normalize and cleanup
    let fileRoute = m.replace(`./${root}/${src}`, ""); // i.e src/routesDir
    fileRoute = path.join(prefix, fileRoute);

    const base = path.basename(fileRoute);
    const fullPrefix = path.dirname(fileRoute);

    if (index.test(base) || indexShadow.test(base)) {
      // index.js || (page).js
      route = path.join(fullPrefix, "/");
    } else if (dynamic.test(base)) {
      // $id.js
      const dyn = dynamic.exec(base)![1];
      route = path.join(fullPrefix, `/:${dyn}`);
    } else if (std.test(base)) {
      // route.js
      const val = std.exec(base)![1];
      route = path.join(fullPrefix, val);
    } else if (multiPart.test(base)) {
      // auth.local.js
      const val = multiPart.exec(base)![0].replace(".js", "");
      const parts = val.split(".");
      route = path
        .join(fullPrefix, parts.join("/"))
        .replace("$", ":")
        .replace("index", "");
    } else {
      logger.error(`found file ${m} with invalid route syntax`);
      process.exit(1);
    }

    route = route!.replace(/\\/g, "/"); // windows backslashes

    return {
      basename: base,
      dirname: prefix,
      filePath: m,
      route,
    };
  });

  return new ManifestData(routes);
}
