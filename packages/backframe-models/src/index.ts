import { Session, User } from "./models.js";

// Object mimicking expected database shape
export interface DB {
  user: DbEntry<User>;
  session: DbEntry<Session>;
  [key: string]: DbEntry<unknown>;
}

export interface DbEntry<T> {
  create: <S extends BooleanKeys<T>>(args: {
    data: T;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  delete: <S extends BooleanKeys<T>>(args: {
    where: T;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  deleteMany: <S extends Partial<T> & ExpandWithOps<Partial<T>>>(args: {
    where: S;
  }) => Promise<{ count: number }>;
  findFirst: <
    S extends BooleanKeys<T>,
    W extends Partial<T> & ExpandWithOps<Partial<T>>
  >(args: {
    where?: W;
    select?: S;
    skip?: number;
    take?: number;
    orderBy?: SortOrder<Partial<T>>;
    distinct?: keyof T;
    cursor?: Partial<T>;
  }) => Promise<InferKeys<S, T> | T>;
  findMany: <
    S extends BooleanKeys<T>,
    W extends Partial<T> & ExpandWithOps<Partial<T>>
  >(args: {
    where?: W;
    select?: S;
    skip?: number;
    take?: number;
    orderBy?: SortOrder<Partial<T>>;
    distinct?: keyof T;
    cursor?: Partial<T>;
  }) => Promise<Array<InferKeys<S, T> | T>>;
  findUnique: <
    S extends BooleanKeys<T>,
    K extends keyof T & Unique<string>
  >(args: {
    where: Pick<T, K>;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  update: <S extends BooleanKeys<T>>(args: {
    where: Partial<T>;
    data: Partial<T>;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  updateMany: <S extends Partial<T> & ExpandWithOps<Partial<T>>>(args: {
    where: S;
    data: Partial<T>;
  }) => Promise<{ count: number }>;
  upsert: <S extends BooleanKeys<T>>(args: {
    where: Partial<T>;
    create: T;
    update: Partial<T>;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  groupBy: <S extends BooleanKeys<T>>(args: {
    where?: Partial<T>;
    by: Array<keyof T>;
    having?: Partial<T>;
    take?: number;
    skip?: number;
    orderBy?: SortOrder<Partial<T>>;
    select?: S;
  }) => Promise<Array<InferKeys<S, T> | T>>;
  count: (args: {
    where?: Partial<T>;
    orderBy?: SortOrder<Partial<T>>;
    cursor?: Partial<T>;
    take?: number;
    skip?: number;
    distinct?: keyof T;
  }) => Promise<number>;
  aggregate: (args: {
    where?: Partial<T>;
    orderBy?: SortOrder<Partial<T>>;
    cursor?: Partial<T>;
    take?: number;
    skip?: number;
    distinct?: keyof T;
    _count?: true;
    _max?: true;
    _min?: true;
  }) => Promise<{
    _count: number;
    _min: Partial<T>;
    _max: Partial<T>;
  }>;
}

export type Unique<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
};

export type SortOrder<T> = {
  [key in keyof T]: "asc" | "desc";
};

export type ExpandWithOps<T> = {
  OR?: T & ExpandWithOps<T>;
  AND?: T & ExpandWithOps<T>;
  NOT?: T & ExpandWithOps<T>;
};

export type InferKeys<B, O> = {
  [key in keyof (B | O)]: O[key];
};

export type Enumerable<T> = T | Array<T>;

export type BooleanKeys<T> = {
  [key in keyof T]: boolean;
};
