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
}

export class BigInt extends Base {
  constructor(private _max = 100000, private _min = 0) {
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
}
