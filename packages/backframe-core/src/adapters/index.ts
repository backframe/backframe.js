export type BfModelFilterOps<T> = {
  and?: BfWhere<T>[];
  or?: BfWhere<T>[];
  not?: BfWhere<T>;
};

export type BfModelCompareOps<T> = {
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  in?: T[];
  not?: T;
  notIn?: T[];
  contains?: T;
  startsWith?: T;
  endsWith?: T;
  equals?: T;
};

export type BfWhere<T> = {
  [P in keyof T]: T[P] extends object
    ? BfWhere<T[P]> & BfModelFilterOps<T[P]>
    : T[P] extends Array<infer U>
    ? BfWhere<U> & BfModelFilterOps<U>
    : T[P] extends string | number | boolean
    ? BfModelCompareOps<T[P]>
    : T[P];
};

export abstract class BfDatabase {
  abstract create<T>(
    model: string,
    data: Partial<T>
  ): Promise<Partial<T> | object>;

  abstract read<T>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<Partial<T> | object>;

  abstract list<T>(
    model: string,
    args: {
      where?: BfWhere<T>;
      limit?: number;
      offset?: number;
    }
  ): Promise<Array<Partial<T> | object>>;

  abstract update<T>(
    model: string,
    args: { where: BfWhere<T>; data: Partial<T> }
  ): Promise<Partial<T> | object>;

  abstract delete<T>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<Partial<T> | object>;

  abstract hasModel(model: string): boolean;
}
