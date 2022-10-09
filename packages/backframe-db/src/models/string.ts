import { z } from "zod";
import { Base } from "./base.js";

export class Str extends Base {
  constructor(
    private _isEmail = false,
    private _isUnique = false,
    private _maxLen = 255,
    private _minLen = 0
  ) {
    super(false, "");
  }

  email() {
    this._isEmail = true;
    return this;
  }

  unique() {
    this._isUnique = true;
    return this;
  }

  max(len: number) {
    this._maxLen = len;
    return this;
  }

  min(len: number) {
    this._minLen = len;
    return this;
  }

  __genSchema() {
    const s = z.string().default(this._default as string);
    if (!this._isRequired) {
      return s.optional();
    }
    return s;
  }
}
