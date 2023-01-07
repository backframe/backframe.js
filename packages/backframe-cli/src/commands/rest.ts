/* eslint-disable no-console */

import loadBfCfg, { IBfServer } from "@backframe/core";
import type { DB } from "@backframe/models";
import { loadModule, logger } from "@backframe/utils";
import { cyan, green, magenta, yellow } from "kleur/colors";
import { table } from "table";
import { defineBfCommand } from "./index";

export default defineBfCommand({
  command: "rest",
  description: "A command to manage REST api functionality",
  builder: (_) => {
    _.command(
      "routes",
      "List configured project routes",
      (_) => {
        //
      },
      async (_h) => {
        await printRoutesTable();
      }
    ).command(
      "generate <resource>",
      "Generate a new resource",
      (_) => {
        _.option("skip-model", {
          boolean: true,
        }).option("skip-tests", {
          boolean: true,
          default: true,
        });
      },
      (h) => {
        console.log(h);
      }
    );
  },
});

async function printRoutesTable() {
  // dont log anything
  process.env.BF_SILENT_LOG = "true";

  const cfg = await loadBfCfg();
  const entry = cfg.getAbsDirPath("entryPoint");
  const file = await loadModule(entry);

  if (!file.default) {
    logger.error(`expected a default export from ${entry}`);
    process.exit(1);
  }

  const server: IBfServer<DB> = file.default;
  await server.$init(cfg);
  const routes = server.$listRoutes();

  // print table in the follwing format:
  // | route             | origin
  // | /api/v1/users     | FILE: /path/to/file
  // | /api/v1/users/:id | PLUGIN: plugin-name
  const tbl = routes.map((route) => {
    return [
      route.route,
      `${route.type === "FILE" ? cyan(route.type) : green(route.type)}: ${
        route.name
      }`,
    ];
  });

  tbl.unshift([yellow("Route"), magenta("Origin")]);

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
