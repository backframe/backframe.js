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
    if (this.#items.some(($) => $.route === i.route)) {
      logger.warn(`duplicate route: ${i.route} found`);
      logger.warn("one of the routes will be overriden");
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
