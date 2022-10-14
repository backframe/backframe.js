import { z } from "zod";
import { Base } from "./base.js";

export class Int extends Base {
  constructor(private _max = 255, private _min = 0) {
    super(false, 0);
  }

  max(val: number) {
    this._max = val;
    return this;
  }

  min(val: number) {
    this._min = val;
    return this;
  }

  __genSchema() {
    const s = z.number().default(this._default as number);
    if (!this._isRequired) {
      return s.optional();
    }
    return s;
  }
}

export class Float extends Base {
  constructor(private _max = 255, private _min = 0) {
    super(false, 0.0);
  }

  max(val: number) {
    this._max = val;
    return this;
  }

  min(val: number) {
    this._min = val;
    return this;
  }

  __genSchema() {
    const s = z.number().default(this._default as number);
    if (!this._isRequired) {
      return s.optional();
    }
    return s;
  }
}
