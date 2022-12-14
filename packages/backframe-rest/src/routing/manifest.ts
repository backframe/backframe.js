import { Item } from "./index.js";

export class ManifestData {
  constructor(private items: Item[]) {}

  getItems() {
    return this.items;
  }

  getRoutes() {
    return this.items.map((i) => i.route);
  }
}
