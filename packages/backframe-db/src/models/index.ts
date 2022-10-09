import { z } from "zod";
import { DateTime } from "./datetime.js";
import { BigInt as MyBigInt, Float, Int } from "./number.js";
import { Str } from "./string.js";

export type ModelType = Str | Int | Float | MyBigInt | DateTime;

export class Model {
  constructor(public fields: { [prop: string]: ModelType }) {
    Object.keys(fields).map((f) => {
      // set field name
      fields[f].__fieldName = f;
    });
  }

  __genSchema() {
    const values: z.ZodRawShape = {};
    Object.keys(this.fields).map((field) => {
      values[field] = this.fields[field].__genSchema();
    });
    return z.object(values);
  }
}
