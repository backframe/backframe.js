/* eslint-disable @typescript-eslint/no-explicit-any */
import { BfWhere, type BfDatabase } from "@backframe/core";
import { type PrismaClient } from "@prisma/client";

export class PrismaAdapter<T> implements BfDatabase {
  constructor(private client: PrismaClient<T>) {}

  async create<T>(model: string, data: Partial<T>) {
    const db: any = this.client[model as keyof PrismaClient<T>];
    return await db.create({ data });
  }

  async read<T>(model: string, args: { where: BfWhere<T> }) {
    const db: any = this.client[model as keyof PrismaClient<T>];
    return await db.findFirst({ where: args.where });
  }

  async delete<T>(model: string, args: { where: BfWhere<T> }) {
    const db: any = this.client[model as keyof PrismaClient<T>];
    return await db.delete({ where: args.where });
  }

  async list<T>(
    model: string,
    args: { where?: BfWhere<T>; limit?: number; offset?: number }
  ) {
    const db: any = this.client[model as keyof PrismaClient<T>];
    return await db.findMany({
      where: args.where,
      take: args.limit,
      skip: args.offset,
    });
  }

  async update<T>(
    model: string,
    args: { where: BfWhere<T>; data: Partial<T> }
  ) {
    const db: any = this.client[model as keyof PrismaClient<T>];
    return await db.update({ where: args.where, data: args.data });
  }

  hasModel(model: string): boolean {
    return Object.keys(this.client).includes(model);
  }
}
