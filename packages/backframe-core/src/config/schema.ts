import { z } from "zod";
import { BfPluginConfig } from "../plugins/index.js";

export const BF_CONFIG_DEFAULTS = {
  root: "src",
  gqlDir: "graphql",
  viewsDir: "views",
  routesDir: "routes",
  staticDir: "static",
  entryPoint: "server.js",
  interfaces: {
    rest: {
      urlPrefix: "/",
    },
    graphql: {
      mount: "/graphql",
    },
  },
  plugins: [] as BfPluginConfig[],
  database: {
    provider: "postgres",
    url: process.env.DB_URL || "",
  },
  authentication: {
    strategy: "token-based",
    providers: [] as { [key: string]: string }[],
  },
};

export const BfUserConfigSchema = z.object({
  root: z.string().optional().default(BF_CONFIG_DEFAULTS.root),
  routesDir: z.string().optional().default(BF_CONFIG_DEFAULTS.routesDir),
  gqlDir: z.string().optional().default(BF_CONFIG_DEFAULTS.gqlDir),
  staticDir: z.string().optional().default(BF_CONFIG_DEFAULTS.staticDir),
  viewsDir: z.string().optional().default(BF_CONFIG_DEFAULTS.viewsDir),
  entryPoint: z.string().optional().default(BF_CONFIG_DEFAULTS.entryPoint),
  interfaces: z
    .object({
      rest: z
        .object({
          urlPrefix: z
            .string()
            .optional()
            .default(BF_CONFIG_DEFAULTS.interfaces.rest.urlPrefix),
        })
        .optional()
        .default({}),
      graphql: z
        .object({
          mount: z.string().optional().default("/graphql"),
        })
        .optional()
        .default({}),
    })
    .optional()
    .default({}),
  database: z
    .object({
      url: z.string(),
      provider: z.string(),
    })
    .optional(),
  authentication: z
    .object({
      strategy: z.enum(["token-based", "session-based"]).default("token-based"),
      providers: z.array(
        z.object({
          provider: z.string(),
          config: z.object({
            clientID: z.string(),
            clientSecret: z.string(),
          }),
        })
      ),
    })
    .optional(),
  plugins: z.array(z.custom<BfPluginConfig>()).optional().default([]),
});

// NOTE(vndaba): Prefer manual definition of `BfUserConfig` to enable jsdocs
export type BfUserConfig = z.input<typeof BfUserConfigSchema>;

// export interface BfUserConfig {
//   /**
//    * Configure the project root directory. All other directories will be resolved relative to this one
//    * @default `"."` (current working dir)
//    */
//   root?: string;
//   /**
//    * Configure the directory where the rest routes will be defined
//    * @default `./routes`
//    */
//   routesDir?: string;
//   /**
//    * Set the directory where graphql routes will be defined
//    * @default `./graphql`
//    */
// }
