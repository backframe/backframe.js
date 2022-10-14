import { z } from "zod";
import { Base } from "./base.js";

export class DateTime extends Base {
  constructor(private _isUpdatedAt = false) {
    super(true, new Date());
  }

  updatedAt() {
    this._isUpdatedAt = true;
    return this;
  }

  __genSchema() {
    const s = z.date().default(this._default as Date);
    if (!this._isRequired) {
      return s.optional();
    }
    return s;
  }
}
