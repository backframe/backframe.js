/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLObjectType, GraphQLSchema } from "graphql";

export class SchemaConfig<C> {
  #schema: GraphQLSchema;
  #types: GraphQLObjectType[];
  #queries: [];
  #mutations: [];
  #subscriptions: [];
  #directives: [];

  query<T, U extends GraphQLObjectType>(
    name: string,
    cfg: {
      args?: T;
      schema: U;
      resolve: (parent: unknown, args: T, ctx: C, info: unknown) => void;
    }
  ) {
    //TODO: Validate name
    const _type = new GraphQLObjectType({
      name,
      fields: {},
    });
    if (!this.#types.includes(cfg.schema)) {
      this.#types.push(cfg.schema); // register new schema
    }
  }
}

export function gql() {
  //
}

export function createObject() {
  //
}

export function createInput() {
  //
}

export function createResolver() {
  //
}

export function createQuery() {
  //
}

export function createMutation() {
  //
}

export function createSubscription() {
  //
}

export function createDirective() {
  //
}

export function defineSchema() {
  //
}
