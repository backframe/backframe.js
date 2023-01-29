import loadBfCfg, { IBfServer } from "@backframe/core";
import { loadModule, logger } from "@backframe/utils";
import { cyan, green, magenta, yellow } from "kleur/colors";
import { table } from "table";

export async function routes() {
  // dont log anything, except errors
  process.env.BF_SILENT_LOG = "true";

  const cfg = await loadBfCfg();
  const entry = cfg.getAbsDirPath("entryPoint");
  const file = await loadModule(entry);

  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: IBfServer = file.default;
  await server.$init(cfg);
  const routes = server.$listRoutes();

  // print table in the follwing format:
  // | route             | origin
  // | /api/v1/users     | FILE: /path/to/file
  // | /api/v1/users/:id | PLUGIN: plugin-name
  const tbl = routes
    .sort((a, b) => {
      if (b.route > a.route) return -1;
      return 1;
    })
    .map((route) => {
      return [
        route.route,
        `${route.type === "FILE" ? cyan(route.type) : green(route.type)}: ${
          route.name
        }`,
      ];
    });

  tbl.unshift([yellow("Route"), magenta("Origin")]);

  // eslint-disable-next-line no-console
  console.log(
    table(tbl, {
      spanningCells: [
        {
          col: 0,
          row: 0,
          alignment: "center",
          colSpan: 1,
        },
        {
          col: 1,
          row: 0,
          alignment: "center",
          colSpan: 1,
        },
      ],
    })
  );
}
