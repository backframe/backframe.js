/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BfDatabase,
  BfModelCompareOps,
  BfModelFilterOps,
  BfWhere,
} from "@backframe/core";
import { Dialect, and, eq, or } from "drizzle-orm";

function toDrizzleWhere(table: any, where: BfWhere<unknown>): any {
  const length = Object.keys(where).length;
  if (length === 0) {
    return undefined;
  }

  if (length > 1) {
    throw new Error(
      "Only one where clause is supported. If you need more, combine them with `and` or `or`"
    );
  }

  type Key = keyof BfModelCompareOps<unknown> | keyof BfModelFilterOps<unknown>;
  const key = Object.keys(where)[0] as Key;
  const value = where[key as keyof typeof where];

  if (key === "and") {
    const args = [];
    for (const [k, v] of Object.entries(value as BfWhere<unknown>)) {
      args.push(toDrizzleWhere(table, { [k]: v }));
    }

    return and(...args);
  } else if (key === "or") {
    const args = [];
    for (const [k, v] of Object.entries(value as BfWhere<unknown>)) {
      args.push(toDrizzleWhere(table, { [k]: v }));
    }

    return or(...args);
  } else if (key === "equals") {
    return eq(table[key], value);
  } else {
    return eq(table[key], value);
  }
}

export class DrizzleAdapter<
  TDialect extends Dialect,
  TClient,
  TModels extends Array<{ key: string; table: unknown }>
> implements BfDatabase
{
  constructor(
    private dialect: TDialect,
    private client: TClient,
    private models: TModels
  ) {}

  #table(model: string) {
    const table = this.models.find((m) => m.key === model)?.table;
    if (!table) {
      throw new Error(`Model ${model} not found`);
    }
    return table;
  }

  async create<T>(model: string, data: Partial<T>) {
    const table = this.#table(model);
    const client = this.client as any;
    let promise = client.insert(table).values(data);

    if (this.dialect !== "mysql") {
      promise = promise.returning();
    }

    return await promise;
  }

  async delete<T>(model: string, args: { where: BfWhere<T> }) {
    const table = this.#table(model);
    const client = this.client as any;
    let promise = client.delete(table).where(toDrizzleWhere(table, args.where));

    if (this.dialect !== "mysql") {
      promise = promise.returning();
    }

    return await promise;
  }

  async list<T>(
    model: string,
    {
      limit,
      offset,
      where,
    }: { where?: BfWhere<T>; limit?: number; offset?: number }
  ) {
    const table = this.#table(model);
    const client = this.client as any;
    let promise = client.select().from(table);

    if (where) {
      promise = promise.where(toDrizzleWhere(table, where));
    }

    if (limit) {
      promise = promise.limit(limit);
    }

    if (offset) {
      promise = promise.offset(offset);
    }

    return await promise;
  }

  async read<T>(model: string, args: { where: BfWhere<T> }) {
    const table = this.#table(model);
    const client = this.client as any;
    return await client
      .select()
      .from(table)
      .where(toDrizzleWhere(table, args.where));
  }

  async update<T>(
    model: string,
    args: { where: BfWhere<T>; data: Partial<T> }
  ) {
    const table = this.#table(model);
    const client = this.client as any;
    let promise = client
      .update(table)
      .set(args.data)
      .where(toDrizzleWhere(table, args.where));

    if (this.dialect !== "mysql") {
      promise = promise.returning();
    }

    return await promise;
  }

  hasModel(model: string): boolean {
    return this.models.some((m) => m.key === model);
  }
}
