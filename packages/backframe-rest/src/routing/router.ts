import { BfConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import { globbySync } from "globby";
import path from "path";
import { Manifest } from "./manifest.js";

export interface RouteItem {
  route: string;
  filePath: string;
  basename: string;
  dirname: string;
  isExtended?: boolean;
  pluginName?: string;
}

const stdRoute = /^([^$()[\]]+).js$/;
const indexRoute = /^index.js$/;
const indexShadow = /^\([^)]+\).js$/;
const dynRoute = /^\$(\w+).js$/;
const multiPart = /^((?:(?:\w+|\$\w+).){2,})js$/;
const catchAll = /^\$.js$/;

const SPEC = [
  // index route: index.js -> /
  [indexRoute, () => "/"],
  // index shadow route: (page).js => /
  [indexShadow, () => "/"],
  // dynamic route: $id.js -> /:id
  [dynRoute, (v: string) => `/:${dynRoute.exec(v)[1]}`],
  // catchAll route: $.js -> /*
  [catchAll, () => "/*"],
  // multipart route: a.b.js -> /a/b
  [
    multiPart,
    (v: string) => {
      const val = multiPart.exec(v)[1].replace(/.$/, "");
      return val.split(".").join("/").replace("$", ":").replace("index", "");
    },
  ],
  // standard route a.js (no special chars)
  [stdRoute, (v: string) => stdRoute.exec(v)[1]],
];

export class Router {
  #prefix: string;
  #rootDir: string;
  #sourceDir: string;

  matches: string[];
  manifest: Manifest;

  constructor(private bfConfig: BfConfig, private origin?: string) {
    this.#prefix = bfConfig.getInterfaceConfig("rest").urlPrefix;
    this.manifest = new Manifest(bfConfig);
  }

  init(root?: string, routesDir?: string) {
    const cfg = this.bfConfig;
    const cwd = root ?? cfg.getDirName("root");
    const src = routesDir ?? cfg.getDirName("routesDir");
    const ptrn = `./${src}/**/*.js`;

    this.#rootDir = cwd;
    this.#sourceDir = src;

    const matches = globbySync(ptrn, { cwd });
    if (!matches.length) {
      logger.warn(`no routes detected in the ${src} directory`);
    }
    this.matches = matches;
    matches.map((m) => this.#processRoute(m.replace("./", `./${cwd}/`)));
  }

  #processRoute(r: string) {
    const fileRoute = this.#normalizeRoute(r);
    const base = path.basename(fileRoute);
    const leading = path.dirname(fileRoute);

    // try match route pattern
    let route;
    this.#validateRoute(base);

    for (const s of SPEC) {
      const re = s[0] as RegExp; // regex
      const cb = s[1] as (s: string) => string; // callback

      if (re.test(base)) {
        route = path.join(leading, cb(base)).replace(/\\/g, "/"); // windows backslashes
        break;
      }
    }

    // no match
    if (!route) {
      logger.error(
        `found file: \`${this.#strip(r)}\` with invalid route syntax`
      );
      process.exit(1);
    }

    const item: RouteItem = {
      route,
      basename: base,
      filePath: r,
      dirname: path.dirname(r),
      pluginName: this.origin ?? undefined,
    };

    this.manifest.add(item);
  }

  #strip(r: string) {
    // strip prefix
    return r.replace(`./${this.#rootDir}/`, "");
  }

  #normalizeRoute(route: string) {
    // strip leading dirs and add prefix
    const r = route.replace(`./${this.#rootDir}/${this.#sourceDir}`, "");
    return path.join(this.#prefix, r);
  }

  #validateRoute(route: string) {
    type Rule =
      | "unterminated parens"
      | "unallowed characters"
      | "capitalized casing";

    const spec = {
      "unterminated parens": [/^\(\w+.js$/, /^\w+\).js$/],
      "unallowed characters": [/^[[\]].js$/],
      "capitalized casing": [/^[A-Z]+.js$/],
    };

    Object.keys(spec).forEach((rule) => {
      const re = spec[rule as Rule];
      re.forEach((r) => {
        if (r.test(route)) {
          logger.error(
            `found invalid route: \`${this.#strip(route)}\` with ${rule}`
          );
          process.exit(1);
        }
      });
    });
  }

  // Manually add route to the manifest with reading from file-system
  addRoute(route: string, origin?: string) {
    // set to null to skip reading file
    this.manifest.add({
      basename: origin || route,
      dirname: null,
      filePath: null,
      route,
    });
  }

  // Merge one router into another to enable extending one from another
  mergeRouter(router: Router) {
    const { items } = router.manifest;
    items.forEach((itm) => {
      itm.isExtended = true;
      this.manifest.add(itm);
    });
  }
}
