import { BigInt as MyBigInt, Float, Int } from "./number.js";
import { Str } from "./string.js";

export type ModelType = Str | Int | Float | MyBigInt;

export class Model {
  constructor(public fields: { [prop: string]: ModelType }) {
    Object.keys(fields).map((f) => {
      // set field name
      fields[f].__fieldName = f;
    });
  }
}
