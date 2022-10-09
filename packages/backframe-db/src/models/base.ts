export class Base {
  private _name!: string;

  constructor(
    public _isRequired = false,
    public _default: string | number | boolean | Date
  ) {}

  required() {
    this._isRequired = true;
    return this;
  }

  default(value: string | number | boolean | Date) {
    this._default = value;
    return this;
  }

  get __fieldName() {
    return this._name;
  }

  set __fieldName(val: string) {
    this._name = val;
  }
}
