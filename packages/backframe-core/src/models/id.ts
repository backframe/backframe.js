import { Base } from "./base.js";

export class ID extends Base {
  constructor(
    private _primaryKey = false,
    private _autoIncrement = false,
    private _isForeignKey = false,
    private _foreignField = ""
  ) {
    super(true, 0);
  }

  autoIncrement() {
    this._autoIncrement = true;
    return this;
  }
}
