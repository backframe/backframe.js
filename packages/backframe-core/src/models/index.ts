import { z } from "zod";
import { DateTime } from "./datetime.js";
import { Float, Int } from "./number.js";
import { Str } from "./string.js";

export type ModelType = Str | Int | Float | DateTime;

export class Model {
  constructor(
    public name: string,
    public fields: { [prop: string]: ModelType }
  ) {
    Object.keys(fields).map((f) => {
      // set field name
      fields[f].__fieldName = f;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __validate(value: { [key: string]: any }) {
    Object.keys(value).map((key) => {
      if (!this.fields[key]) return false;
      const schema = this.fields[key].__genSchema();
      const opts = schema.safeParse(value);
      if (!opts.success) return false;
      return true;
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
