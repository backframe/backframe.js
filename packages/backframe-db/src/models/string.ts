import { Base } from "./base.js";

export class Str extends Base {
  constructor(
    private _isEmail = false,
    private _isUnique = false,
    private _maxLen = 255,
    private _minLen = 0
  ) {
    super(false, "default");
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
}
