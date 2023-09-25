/* eslint-disable @typescript-eslint/no-explicit-any */
export type BfModelFilterOps<T> = {
  AND?: BfWhere<T>[];
  OR?: BfWhere<T>[];
  NOT?: BfWhere<T>;
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
    ? T[P] | BfModelCompareOps<T[P]>
    : T[P];
} & BfModelFilterOps<T>;

export abstract class BfDatabase {
  abstract create<T, U = any>(model: string, data: Partial<T>): Promise<U>;

  abstract read<T, U = any>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<U>;

  abstract list<T, U = any>(
    model: string,
    args: {
      where?: BfWhere<T>;
      limit?: number;
      offset?: number;
    }
  ): Promise<U>;

  abstract update<T, U = any>(
    model: string,
    args: { where: BfWhere<T>; data: Partial<T> }
  ): Promise<U>;

  abstract delete<T, U = any>(
    model: string,
    args: { where: BfWhere<T> }
  ): Promise<U>;

  abstract hasModel(model: string): boolean;
}
