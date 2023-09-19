type BooleanKeys<T> = {
  [key in keyof T]: boolean;
};

type InferKeys<B, O> = {
  [key in keyof (B | O)]: O[key];
};

export type SortOrder<T> = {
  [key in keyof T]: "asc" | "desc";
};

export type ExpandWithOps<T> = {
  OR?: T & ExpandWithOps<T>;
  AND?: T & ExpandWithOps<T>;
  NOT?: T & ExpandWithOps<T>;
};

type QueryWithRelations<T> = {
  every?: ExpandWithOps<T>;
  some?: ExpandWithOps<T>;
  none?: ExpandWithOps<T>;
};

type CreateWithRelations<T extends { id?: string }> = {
  create?: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
  connect?: Partial<Pick<T, "id">>;
  connectOrCreate?: {
    where: Partial<Pick<T, "id">>;
    create: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
  };
};

type ExpandedCreate<T> = {
  [P in keyof T]: T[P] extends object
    ? CreateWithRelations<T[P]>
    : T[P] extends object[]
    ? CreateWithRelations<T[P][0]>
    : T[P];
};

type ExpandedDeleteMany<T> = {
  [P in keyof T]: T[P] extends object[] ? QueryWithRelations<T[P]> : T[P];
};

type ExpandedFindFirst<T> = {
  [P in keyof T]: T[P] extends object ? QueryWithRelations<T[P]> : T[P];
};

type DeleteIncludeClause<T> = {
  _count?:
    | boolean
    | {
        select?: {
          [P in keyof T]?: T[P] extends object | object[] ? boolean : never;
        };
      };
} & {
  [P in keyof T]?: T[P] extends object | object[]
    ?
        | boolean
        | {
            cursor?: Partial<T[P]>;
            skip?: number;
            take?: number;
            orderBy?: SortOrder<Partial<T>>;
            distinct?: keyof T;
            where?: T[P];
            select?: T[P];
          }
    : never;
};

export abstract class BfDatabase {
  abstract model(name: string): BfDatabaseModel;
}

export abstract class BfDatabaseModel {
  [key: string]: unknown;

  abstract create<T, S extends BooleanKeys<T>>(args: {
    data: ExpandedCreate<T>;
    select?: S;
  }): Promise<InferKeys<S, T> | T>;
  abstract findUnique<T, S extends BooleanKeys<T>, K extends keyof T>(args: {
    where: Pick<T, K>;
    select?: S;
  }): Promise<InferKeys<S, T> | T>;
  abstract findMany<
    T,
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
  }): Promise<Array<InferKeys<S, T> | T>>;
  abstract findFirst<
    T,
    S extends BooleanKeys<T>,
    W extends Partial<T> & ExpandWithOps<Partial<T>>
  >(args: {
    where?: ExpandedFindFirst<W>;
    select?: S;
    skip?: number;
    take?: number;
    orderBy?: SortOrder<Partial<T>>;
    distinct?: keyof T;
    cursor?: Partial<T>;
  }): Promise<InferKeys<S, T> | T>;
  abstract update<T, S extends BooleanKeys<T>>(args: {
    where: Partial<T>;
    data: Partial<T>;
    select?: S;
  }): Promise<InferKeys<S, T> | T>;
  abstract updateMany<
    T,
    S extends Partial<T> & ExpandWithOps<Partial<T>>
  >(args: { where: S; data: Partial<T> }): Promise<{ count: number }>;
  abstract delete<T, S extends BooleanKeys<T>>(args: {
    where: T;
    select?: S;
    include?: DeleteIncludeClause<T>;
  }): Promise<InferKeys<S, T> | T>;
  abstract deleteMany<
    T,
    S extends Partial<T> & ExpandWithOps<Partial<T>>
  >(args: { where: ExpandedDeleteMany<S> }): Promise<{ count: number }>;
  abstract upsert<T, S extends BooleanKeys<T>>(args: {
    where: Partial<T>;
    create: T;
    update: Partial<T>;
    select?: S;
  }): Promise<InferKeys<S, T> | T>;
  abstract count<T>(args: {
    where?: Partial<T>;
    orderBy?: SortOrder<Partial<T>>;
    cursor?: Partial<T>;
    take?: number;
    skip?: number;
    distinct?: keyof T;
  }): Promise<number>;
}
