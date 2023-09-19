/**
 * General
 */
export type BaseModel = {
  id?: Unique<string | number>;
};

/**
 * Handle Generic Unique Types
 */
export type Unique<T> = {
  [P in keyof T]: T;
} & { unique: true };

export type ExtractUnique<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Unique<unknown> ? K : never }[keyof T]
>;

export type ExtractInner<T> = {
  [K in keyof T]: T[K] extends Unique<infer U> ? U : T[K];
};

export type ExtractNestedModels<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends BaseModel | BaseModel[] ? K : never }[keyof T]
>;

export type RemoveNestedModels<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends BaseModel | BaseModel[] ? never : K }[keyof T]
>;

export type Truthy<T> = {
  [K in keyof T]: T[K] extends object
    ? Truthy<T[K]>
    : T extends false
    ? never
    : K;
};

export type ExtractTruthy<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends true | object ? K : never;
  }[keyof T]
>;

export type BooleanKeys<T> = {
  [key in keyof T]: boolean;
};

export type InferKeys<B, O> = {
  [key in keyof (B | O)]: O[key];
};

/**
 * Utilities passed to select arg where applicable
 */
export type CountInput<T> =
  | boolean
  | { select?: Partial<BooleanKeys<ExtractNestedModels<T>>> };

export type SelectInput<T> = {
  [key in keyof T]: T[key] extends BaseModel
    ? boolean | ModelArgs<T[key]>
    : T[key] extends Array<infer U>
    ? boolean | ModelWhereUniqueInput<U>
    : boolean;
} & { _count?: CountInput<T> };

export type SelectOutput<T, O> = {
  [key in keyof (T | O)]: T[key] extends
    | { include: infer U }
    | { select: infer U }
    ? O[key] extends Array<infer V>
      ? SelectOutput<U, ExtractInner<V>>[]
      : SelectOutput<U, ExtractInner<O>[key]>
    : O[key] extends BaseModel
    ? SelectOutput<T[key], ExtractInner<O>[key]>
    : O[key] extends Array<infer U>
    ? SelectOutput<BooleanKeys<RemoveNestedModels<U>>, U>[]
    : ExtractInner<O>[key];
} & (T extends { _count: infer U }
  ? {
      _count: U extends { select: infer V }
        ? { [key in keyof V]: number }
        : { [key in keyof ExtractNestedModels<O>]: number };
    }
  : { [key: string]: never });

export type IncludeInput<T> = {
  _count?: CountInput<T>;
} & {
  [K in keyof ExtractNestedModels<T>]: boolean | ModelWhereUniqueInput<T[K]>;
};

/**
 * Model ops and relations
 */
export type ModelSortOrder<T> = {
  [key in keyof T]: "asc" | "desc";
};

export type ModelWhereOps<T> = {
  OR?: T & ModelWhereOps<T>;
  AND?: T & ModelWhereOps<T>;
  NOT?: T & ModelWhereOps<T>;
};

export type ModelArgs<T> = {
  include?: {
    [K in keyof ExtractNestedModels<T>]?:
      | boolean
      | {
          select?: Partial<SelectInput<T[K]>>;
          include?: IncludeInput<T[K]>;
        };
  } & { _count?: CountInput<T> };
  select?: Partial<
    {
      [key in keyof T]: T[key] extends BaseModel
        ? boolean | ModelArgs<T[key]>
        : T[key] extends Array<infer U>
        ? boolean | ModelWhereUniqueInput<U>
        : boolean;
    } & { _count?: CountInput<T> }
  >;
};

export type ModelOutput<S, T> = S extends { select: infer U }
  ? SelectOutput<ExtractTruthy<U>, T>
  : S extends { include: infer U }
  ? SelectOutput<BooleanKeys<RemoveNestedModels<T>> & ExtractTruthy<U>, T>
  : RemoveNestedModels<T>;

export type ModelWhereUniqueInput<T> = {
  skip?: number;
  take?: number;
  orderBy?: ModelSortOrder<Partial<T>>;
  cursor?: Partial<ExtractInner<ExtractUnique<T>>>;
  distinct?: keyof T | Array<keyof T>;
  where?: ModelWhereOps<ExtractInner<T>> & ExtractInner<T>;
} & ModelArgs<T>;

/**
 * Types for create method
 */
export type CreateModelRelations<T> = {
  create?: ExtractInner<T>;
  connect?: ExtractInner<ExtractUnique<T>>;
  connectOrCreate?: {
    create: ExtractInner<T>;
    where: ExtractInner<ExtractUnique<T>>;
  };
};

export type CreateModelArgs<T> = {
  [K in keyof T]: T[K] extends BaseModel
    ? CreateModelRelations<T[K]>
    : T[K] extends Array<infer U>
    ? CreateModelRelations<U>
    : ExtractInner<T>[K];
};

/**
 * Types for delete many
 */

export type DeleteManyModelArgs<T> = {
  [K in keyof T]: T[K] extends Array<infer _U>
    ? {
        every?: "";
        some?: "";
        none?: "";
      }
    : T[K] extends BaseModel
    ? DeleteManyModelArgs<T[K]>
    : T[K];
} & ModelWhereOps<T>;

export type Model<T> = {
  create: <S extends ModelArgs<T>>(
    args: { data: CreateModelArgs<T> } & S
  ) => Promise<ModelOutput<S, T>>;
  delete: <S extends ModelArgs<T>>(
    args: { where: Partial<ExtractInner<ExtractUnique<T>>> } & S
  ) => Promise<ModelOutput<S, T>>;
};
