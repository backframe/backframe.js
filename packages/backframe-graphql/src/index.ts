export class SchemaConfig {
  #query: [];
  #mutations: [];
  #subscriptions: [];
  #directives: [];

  query<T, U>(
    _name: string,
    _cfg: {
      input?: T;
      schema: U;
      resolve: (parent: unknown, args: T, ctx: unknown, info: unknown) => void;
    }
  ) {
    //
  }
}
