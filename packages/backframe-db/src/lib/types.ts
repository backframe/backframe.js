import { DateTime } from "../models/datetime.js";
import { Model, ModelType } from "../models/index.js";
import { BigInt, Float, Int } from "../models/number.js";
import { Str } from "../models/string.js";

export const t = {
  str: () => new Str(),
  int: () => new Int(),
  float: () => new Float(),
  bigint: () => new BigInt(),
  datetime: () => new DateTime(),
  model: (fields: { [prop: string]: ModelType }) => new Model(fields),
};
