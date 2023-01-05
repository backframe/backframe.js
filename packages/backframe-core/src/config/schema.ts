import { z } from "zod";
import { BfPluginConfig } from "../plugins/index.js";

export const BF_CONFIG_DEFAULTS = {
  root: "src",
  viewsDir: "views",
  routesDir: "routes",
  staticDirs: ["static"],
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
  staticDirs: z
    .array(z.string())
    .optional()
    .default(BF_CONFIG_DEFAULTS.staticDirs),
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
      provider: z
        .enum([
          "postgres",
          "sqlite",
          "mysql",
          "cockroachdb",
          "mongodb",
          "sqlserver",
        ])
        .default("postgres"),
    })
    .optional(),
  authentication: z
    .object({
      strategy: z.enum(["token-based", "session-based"]).default("token-based"),
      providers: z.array(
        z.object({
          provider: z.enum([
            "google",
            "facebook",
            "github",
            "twitter",
            "spotify",
            "twitch",
            "discord",
            "reddit",
            "slack",
            "tumblr",
            "yahoo",
            "yandex",
            "vk",
            "okta",
            "auth0",
            "oidc",
            "azure-ad",
            "salesforce",
            "bitbucket",
            "37signals",
            "dropbox",
            "box",
            "evernote",
            "battlenet",
            "dribbble",
            "fitbit",
            "foursquare",
            "github",
            "gitlab",
            "instagram",
            "linkedin",
            "medium",
            "meetup",
            "oauth1",
            "oauth2",
            "office365",
            "paypal",
            "reddit",
            "salesforce",
            "saml",
            "shopify",
            "soundcloud",
            "spotify",
            "strava",
            "twitch",
            "untappd",
            "vkontakte",
            "wordpress",
            "yammer",
            "yandex",
            "zoom",
          ]),
          config: z.object({
            clientID: z.string(),
            clientSecret: z.string(),
            callbackURL: z.string().optional(),
            providerOptions: z.object({}).optional(),
          }),
        })
      ),
    })
    .optional(),
  plugins: z.array(z.custom<BfPluginConfig>()).optional().default([]),
});

export type _BfUserConfig = z.input<typeof BfUserConfigSchema>;

// NOTE(vndaba): Prefer manual definition of `BfUserConfig` to enable decent documentation and intellisense
export type BfUserConfig = {
  /**
   * The root directory of the project
   * @link https://backframe.github.io/js/docs/config#root
   * @default "src"
   */
  root?: string;
  /**
   * This is the directory where all the routes are defined
   * @link https://backframe.github.io/js/docs/config#routesdir
   * @default "routes"
   */
  routesDir?: string;
  /**
   * An array of directories where static files are stored
   * @link https://backframe.github.io/js/docs/config#staticdirs
   * @default ["static"]
   */
  staticDirs?: string[];
  /**
   * This is the directory housing the views/templates in your application (if any)
   * @link https://backframe.github.io/js/docs/config#viewsdir
   * @default "views"
   */
  viewsDir?: string;
  /**
   * The entry point of the application. This is the file where the server is defined and exported. An error will be thrown if the file is not found.
   * @link https://backframe.github.io/js/docs/config#entrypoint
   * @default "server.js"
   */
  entryPoint?: string;
  /**
   * The interfaces/API(s) object contains the configuration for the different interfaces/API(s) that are supported by Backframe. Currently, Backframe supports REST and GraphQL. The `rest` object contains the configuration for the REST API. The `urlPrefix` is the prefix for all the REST routes. The `graphql` object contains the configuration for the GraphQL API. The `mount` is the path where the GraphQL API is mounted.
   * @link https://backframe.github.io/js/docs/config#interfaces
   * @default
   * { rest: { urlPrefix: "/" }, graphql: { mount: "/graphql" } }
   */
  interfaces?: _BfUserConfig["interfaces"];
  /**
   * The database configuration for the backframe application. Backframe uses `Prisma` under the hood and therefore supports all the databases that are supported by `Prisma`. The `url` is the connection string for the database. The `provider` is the database provider that you want to use. The `provider` can be either `postgres`, `sqlite`, `mysql`, `cockroachdb`, `mongodb`, `sqlserver`.
   * @link https://backframe.github.io/js/docs/config#database
   * @default
   * { provider: "postgres", url: process.env.DB_URL }
   */
  database?: _BfUserConfig["database"];
  /**
   * This is where you define the authentication strategy to be used by your application and the providers that you want to use for authentication. The `strategy` can be either `token-based` or `session-based`. The `providers` is an array of objects where each object contains the `provider` and the `config` for that provider. The `config` object contains the `clientID`, `clientSecret` and the `callbackURL` for the provider. The `callbackURL` is optional and is only required if you want to override the default callback URL that is generated by the provider. The `providerOptions` is also optional and is only required if you want to override the default options that are passed to the provider.
   * @link https://backframe.github.io/js/docs/config#authentication
   * @default
   * {
   *    strategy: "token-based",
   *    providers: []
   * }
   * @example
   * import { defineConfig } from "@backframe/core";
   *
   * export default defineConfig({
   *    // ...
   *    authentication: [
   *      strategy: "token-based",
   *      providers: [
   *        {
   *            provider: "google",
   *            config: {
   *            clientID: "google-client-id",
   *            clientSecret: "google-client-secret",
   *            callbackURL: "http://localhost:3000/auth/google/callback",
   *            providerOptions: {
   *            scope: ["profile", "email"],
   *        },
   *     ],
   *    // ...
   * })
   *
   */
  authentication?: _BfUserConfig["authentication"];
  /**
   * The plugins that are enabled for the backframe application along with their configurations. Backframe plugins are simple functions that return an object of type `BfPluginConfig`. The `BfPluginConfig` object contains the `name` of the plugin, along with some other plugin metadata and the `hooks` that the plugin defines. The `hooks` are the functions that are executed at different stages of the lifecycle of your application. For example, the `onInit` hook is executed after the config files have been loaded. When invoked, each hook is passed the `BfConfig` object as its only argument. This allows you to access the configuration of your application from within the plugin.
   *
   * @link https://backframe.github.io/js/docs/config#plugins for more information on plugins
   * @default []
   * @example
   * import { defineConfig, type BfConfig } from "@backframe/core";
   *
   * function myPlugin() {
   *    return {
   *     name: "my-plugin",
   *     onInit: (cfg: BfConfig) => {
   *      // do something
   *     }
   *    }
   * }
   *
   * export default defineConfig({
   *    // ...
   *    plugins: [myPlugin()]
   *    // ...
   * })
   *
   */
  plugins?: _BfUserConfig["plugins"];
};
