import { BfConfig } from "../config/index.js";

export type Plugin = (args: unknown) => BfPluginConfig;
export type PluginListener = (cfg: BfConfig) => void;

export interface BfPluginConfig {
  /**
   * @docs
   * @optional
   * name - the name of the plugin
   *
   * @default `unknown-plugin-$randID`
   */
  name?: string;
  /**
   * @docs
   * @optional
   * description - a simple description of the plugin
   * these values are used to declare your plugin in the plugin manifest
   *
   * @default `unknown-plugin-$randID`
   */
  description?: string;
  /**
   * @docs
   * @optional
   *
   * modify server listener - this is a helper method that allows you to declare a function that will be invoked after the server has been created but before it's started
   *
   * @example
   * ```js
   * {
   *    // ...,
   *    modifyServer(cfg) {
   *      // get access to the internal express app
   *      const app = cfg.server._app
   *
   *      // mount a new route
   *      app.get("/ping", (_rq, rs) => rs.send("pong"))
   *    }
   * }
   */
  modifyServer?: PluginListener;
  /**
   * @docs
   *
   */
  emailProvider?: PluginListener;
  /**
   * @docs
   *
   */
  storageProvider?: PluginListener;
  /**
   * @docs
   *
   */
  compiler?: PluginListener;
}
