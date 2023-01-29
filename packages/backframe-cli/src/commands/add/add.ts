/* eslint-disable no-useless-escape */
import { loadEnv, logger, resolveCwd } from "@backframe/utils";
import { readFileSync, writeFileSync } from "fs";
import { getPackageManager } from "get-pm";
import { globbySync } from "globby";
import { ensureImport, generate, parse, t, visit } from "./babel";

const ALIASES = {
  auth: "@backframe/auth",
  admin: "@backframe/admin",
  storage: "@backframe/storage",
  sockets: "@backframe/sockets",
  testing: "@backframe/testing-lib",
};

function tryResolvePlugin(plugin: string) {
  if (plugin in ALIASES) return ALIASES[plugin];
  return plugin;
}

// Convert an arbitrary NPM package name into a JS identifier
// Some examples:
//  - @astrojs/image => image
//  - @astrojs/markdown-component => markdownComponent
//  - astro-cast => cast
//  - markdown-astro => markdown
//  - some-package => somePackage
//  - example.com => exampleCom
//  - under_score => underScore
//  - 123numeric => numeric
//  - @npm/thingy => npmThingy
//  - @jane/foo.js => janeFoo
//  - @tokencss/astro => tokencss
const toIdent = (name: string) => {
  const ident = name
    .trim()
    // Remove astro or (astrojs) prefix and suffix
    .replace(/[-_\.\/]?backframe(?:js)?[-_\.]?/g, "")
    // drop .js suffix
    .replace(/\.js/, "")
    // convert to camel case
    .replace(/(?:[\.\-\_\/]+)([a-zA-Z])/g, (_, w) => w.toUpperCase())
    // drop invalid first characters
    .replace(/^[^a-zA-Z$_]+/, "");
  return `${ident[0].toLowerCase()}${ident.slice(1)}`;
};

export async function add(plugins: string[], args: Record<string, unknown>) {
  logger.dev(
    `Running add command with args: ${plugins}, ${JSON.stringify(args)}`
  );
  loadEnv();

  const pm = getPackageManager();
  logger.dev(`Using package manager: ${pm.name}`);
  if (!args["skipInstall"]) {
    try {
      await pm.add(plugins);
    } catch (error) {
      console.error(error);
      logger.error(`Failed to install plugins: ${plugins}`);
      logger.error("Please make sure the plugin exists and try again");
      process.exit(1);
    }
  } else {
    logger.dev("Skipping install");
  }
  for (let plugin of plugins) {
    plugin = tryResolvePlugin(plugin);
    logger.dev(`Resolved plugin: ${plugin}`);

    const matches = globbySync("bf.config.*", { onlyFiles: true });
    if (matches.length === 0) {
      logger.error("No bf.config.* file found in the current directory");
      logger.error("Please make sure you are in a backframe project");
      process.exit(1);
    }

    const configPath = matches[0];
    const config = readFileSync(resolveCwd(configPath), "utf-8");
    const configAst = parse(config);
    logger.dev("Parsed bf config file");

    // update the config file
    const pluginId = t.identifier(toIdent(plugin));

    ensureImport(
      configAst,
      t.importDeclaration(
        [t.importDefaultSpecifier(pluginId)],
        t.stringLiteral(plugin)
      )
    );

    visit(configAst, {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ExportDefaultDeclaration(path) {
        if (!t.isCallExpression(path.node.declaration)) return;

        const configObject = path.node.declaration.arguments[0];
        if (!t.isObjectExpression(configObject)) return;

        const integrationsProp = configObject.properties.find((prop) => {
          if (prop.type !== "ObjectProperty") return false;
          if (prop.key.type === "Identifier") {
            if (prop.key.name === "plugins") return true;
          }
          if (prop.key.type === "StringLiteral") {
            if (prop.key.value === "plugins") return true;
          }
          return false;
        }) as t.ObjectProperty | undefined;

        const integrationCall = t.callExpression(pluginId, []);

        if (!integrationsProp) {
          configObject.properties.push(
            t.objectProperty(
              t.identifier("plugins"),
              t.arrayExpression([integrationCall])
            )
          );
          return;
        }

        if (integrationsProp.value.type !== "ArrayExpression")
          throw new Error("Unable to parse integrations");

        const existingIntegrationCall = integrationsProp.value.elements.find(
          (expr) =>
            t.isCallExpression(expr) &&
            t.isIdentifier(expr.callee) &&
            expr.callee.name === pluginId.name
        );

        if (existingIntegrationCall) return;

        integrationsProp.value.elements.push(integrationCall);
      },
    });

    logger.dev("Updated bf config file");
    let output = await generate(configAst);
    const defaultExport = "export default defineConfig";
    output = output
      .replace(defaultExport, `\n${defaultExport}`)
      .replace(/;(\s*;)+/g, ";\n");

    logger.dev("Writing bf config file");
    writeFileSync(configPath, output, "utf-8");

    logger.dev(`Plugin ${plugin} added to bf config`);
  }
}
