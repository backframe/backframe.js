import { BfConfig } from "../config/index.js";

export type Plugin = (args: unknown) => BfPluginConfig;
export type PluginListener = (cfg: BfConfig) => void;

// this are hooks that can be used by the plugin to modify the behavior of the app by `hooking` in at different points of the app lifecycle
export type PluginHooks = {
  /**
   * This hook is called immediately after the `BfUserConfig` has been parsed and the `BfConfig` object is created. This is the first hook that is called. This hook is useful if you want to modify the `BfConfig` object before it is used by the rest of the application. For example, you can use this hook to add additional `BfConfig` properties that are not defined elsewhere.
   * @link https://backframe.github.io/js/docs/plugins/config#onconfiginit
   * @param cfg The `BfConfig` object
   * @example
   * import { defineConfig, type BfConfig } from "@backframe/core";
   *
   * function myPlugin() {
   *   return {
   *      name: "my-plugin",
   *      onConfigInit: (cfg: BfConfig) => {
   *         cfg.pluginsOptions.myPlugin = {
   *            // mount plugin-specific config on the BfConfig object
   *          }
   *      }
   *   }
   * }
   *
   * export default defineConfig({
   *    // ...
   *    plugins: [myPlugin()]
   *    // ...
   * })
   */
  onConfigInit?: PluginListener;
  /**
   * The `onServerInit` hook is called after the `BfConfig` object has been created and the `BfServer` object has been initialized but not started yet. It is in this step that resources are added to the server, middleware applied and other server configuration is done. This hook is useful if you want to modify the `BfServer` object before it is started.
   * @link https://backframe.github.io/js/docs/plugins/config#onserverinit
   * @param cfg The `BfConfig` object
   * @example
   * import { defineConfig, type BfConfig } from "@backframe/core";
   *
   * function myPlugin() {
   *    return {
   *      name: "my-plugin",
   *      onServerInit: (cfg: BfConfig) => {
   *         cfg.server.middleware(function(ctx) {
   *           // ... do something with the ctx object
   *         })
   *      })
   *    }
   * }
   *
   * export default defineConfig({
   *    // ...
   *    plugins: [myPlugin()]
   *    // ...
   * })
   */
  onServerInit?: PluginListener;
  /**
   * The `onServerStart` hook is called after the `BfServer` object has been started. This hook is useful if you want to do something after the server has started.
   * @link https://backframe.github.io/js/docs/plugins/config#onserverstart
   * @param cfg The `BfConfig` object
   * @example
   * import { defineConfig, type BfConfig, logger } from "@backframe/core";
   *
   * function myPlugin() {
   *   return {
   *      name: "my-plugin",
   *      onServerStart: (cfg: BfConfig) => {
   *        logger.info("this will be printed after the server has started")
   *      }
   *   }
   * }
   *
   * export default defineConfig({
   *  // ...
   * plugins: [myPlugin()]
   * // ...
   * })
   *
   */
  onServerStart?: PluginListener;
  onServerStop?: PluginListener;
  onSocketsInit?: PluginListener;
  emailProvider?: PluginListener;
  smsProvider?: PluginListener;
  pushProvider?: PluginListener;
  storageProvider?: PluginListener;
  compiler?: PluginListener;
};

export type BfPluginConfig = {
  /**
   * This is the name assigned to the plugin. This is dispayed to the user when an issue is found with a plugin or general reporting.
   * @link https://backframe.github.io/js/docs/plugins/config#name
   * @default `unknown-plugin-$randID`
   */
  name?: string;
  /**
   * This is a simple description of the plugin. This is dispayed to the user when an issue is found with a plugin or general reporting.
   * @link https://backframe.github.io/js/docs/plugins/config#description
   * @default `unknown-plugin-$randID`
   *
   */
  description?: string;
  /**
   * This is the version of the plugin. This is dispayed to the user when an issue is found with a plugin or general reporting.
   * @link https://backframe.github.io/js/docs/plugins/config#version
   * @default `unknown-plugin-$randID`
   */
  version?: string;
} & PluginHooks;
