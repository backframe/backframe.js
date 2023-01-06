import { BfConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import { RouteItem } from "./router.js";

export class Manifest {
  #items: RouteItem[];

  constructor(private bfConfig: BfConfig) {
    this.#items = [];
  }

  get items() {
    return this.#items;
  }

  get routes() {
    return this.#items.map(($) => $.route);
  }

  add(i: RouteItem) {
    const match = this.#items.find(($) => $.route === i.route);
    if (match) {
      logger.warn(`ignoring duplicate route: \`${i.route}\` found`);

      if (match.isExtended) {
        logger.warn(
          `route is already defined by plugin: \`${match.pluginName}\``
        );
      }
      return;
    }
    this.#items.push(i);
  }

  formatted() {
    this.#items.forEach((_i) => {
      // load js module from file path
      // Get Enabled methods/default ones
      // format these values and return table string
    });
  }

  listRoutes() {
    return this.#items.map(($) => `${$.route}\n`);
  }
}
