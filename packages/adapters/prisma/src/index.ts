import { BfDatabase, BfDatabaseModel } from "@backframe/models";
import { type PrismaClient } from "@prisma/client";

export class PrismaAdapter<T> implements BfDatabase {
  constructor(private client: PrismaClient<T>) {}

  model(name: string): BfDatabaseModel {
    const model = this.client[name as keyof typeof this.client];
    return model as unknown as BfDatabaseModel;
  }
}
