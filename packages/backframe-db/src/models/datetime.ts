import { Base } from "./base.js";

export class DateTime extends Base {
  constructor(private _isUpdatedAt = false) {
    super(true, new Date());
  }

  updatedAt() {
    this._isUpdatedAt = true;
    return this;
  }
}
