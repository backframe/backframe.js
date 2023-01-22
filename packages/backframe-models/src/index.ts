import {
  AuthAccount,
  AuthSession,
  AuthUser,
  AuthVerificationRequest,
  BaseModel,
} from "./models.js";

// Object mimicking expected database shape
// eslint-disable-next-line @typescript-eslint/ban-types
export type DB<T = {}> = {
  authUser: DbEntry<AuthUser>;
  authSession: DbEntry<AuthSession>;
  authAccount: DbEntry<AuthAccount>;
  authVerificationRequest: DbEntry<AuthVerificationRequest>;
  [key: string]: DbEntry<unknown>;
} & { [k in keyof T]: DbEntry<T[k]> };

export * from "./models.js";
export * from "./prisma.js";

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
  [P in keyof T]: T[P] extends BaseModel
    ? CreateWithRelations<T[P]>
    : T[P] extends BaseModel[]
    ? CreateWithRelations<T[P][0]>
    : T[P];
};

type _ExpandedUpdate<T> = {
  [P in keyof T]: T[P] extends BaseModel
    ? CreateWithRelations<T[P]>
    : T[P] extends BaseModel[]
    ? CreateWithRelations<T[P][0]> & {
        delete?: Partial<T[P]>;
        deleteMany: ExpandWithOps<Partial<T[P]>>;
        update?: {
          data: T[P];
          where: Partial<T[P]>;
        };
        updateMany?: {
          data: T[P];
          where: Partial<ExpandWithOps<T[P]>>;
        };
        disconnect?: Partial<T[P]>;
        set?: Partial<T[P]>;
      }
    : T[P];
};

type DeleteIncludeClause<T> = {
  _count?:
    | boolean
    | {
        select?: {
          [P in keyof T]?: T[P] extends BaseModel | BaseModel[]
            ? boolean
            : never;
        };
      };
} & {
  [P in keyof T]?: T[P] extends BaseModel | BaseModel[]
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

type ExpandedDeleteMany<T> = {
  [P in keyof T]: T[P] extends BaseModel[] ? QueryWithRelations<T[P]> : T[P];
};

type ExpandedFindFirst<T> = {
  [P in keyof T]: T[P] extends BaseModel ? QueryWithRelations<T[P]> : T[P];
};

export interface DbEntry<T> {
  create: <S extends BooleanKeys<T>>(args: {
    data: ExpandedCreate<T>;
    select?: S;
  }) => Promise<InferKeys<S, T> | T>;
  delete: <S extends BooleanKeys<T>>(args: {
    where: T;
    select?: S;
    include?: DeleteIncludeClause<T>;
  }) => Promise<InferKeys<S, T> | T>;
  deleteMany: <S extends Partial<T> & ExpandWithOps<Partial<T>>>(args: {
    where: ExpandedDeleteMany<S>;
  }) => Promise<{ count: number }>;
  findFirst: <
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
    K extends keyof T
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


