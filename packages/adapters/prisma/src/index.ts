/* eslint-disable @typescript-eslint/no-explicit-any */
import { BfWhere, type BfDatabase } from "@backframe/core";
import { type PrismaClient } from "@prisma/client";

export class PrismaAdapter implements BfDatabase {
  constructor(private client: PrismaClient) {}

  async create<T, U = any>(model: string, data: Partial<T>): Promise<U> {
    const db: any = this.client[model as keyof PrismaClient];
    return await db.create({ data });
  }

  async read<T, U = any>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<U> {
    const db: any = this.client[model as keyof PrismaClient];
    return await db.findFirst({ where: args.where });
  }

  async delete<T, U = any>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<U> {
    const db: any = this.client[model as keyof PrismaClient];
    return await db.delete({ where: args.where });
  }

  async list<T, U = any>(
    model: string,
    args: { where?: BfWhere<T>; limit?: number; offset?: number }
  ): Promise<U> {
    const db: any = this.client[model as keyof PrismaClient];
    return await db.findMany({
      where: args.where,
      take: args.limit,
      skip: args.offset,
    });
  }

  async update<T, U = any>(
    model: string,
    args: { where: BfWhere<T>; data: Partial<T> }
  ): Promise<U> {
    const db: any = this.client[model as keyof PrismaClient];
    return await db.update({ where: args.where, data: args.data });
  }

  hasModel(model: string): boolean {
    return Object.keys(this.client).includes(model);
  }
}
