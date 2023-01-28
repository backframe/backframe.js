/* eslint-disable @typescript-eslint/ban-types */

import type { Request, Response } from "express";
import { ServerResponse } from "http";
import { Namespace } from "socket.io";
import { z, ZodObject, ZodRawShape, ZodType } from "zod";
import { Context } from "../app/context.js";
import { ResourceConfig } from "../app/handlers.js";
import { GenericException } from "./errors.js";

export type Awaitable<T> =
  | T
  | Omit<Promise<T>, "then" | "catch" | "finally">
  | Omit<PromiseLike<T>, "then" | "catch" | "finally">;

type HasKeys<T> = T extends object
  ? keyof T extends never
    ? false
    : true
  : false;

export type Method = "get" | "post" | "put" | "patch" | "delete";
export type MethodUpper = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ExpressReq<S = Request> = S & { [key: string]: unknown };
export type ExpressRes<S = Response> = S & { [key: string]: unknown };

export type BfHandler = Handler<{}, {}>;
export type BfHandlerConfig = IHandlerConfig<{}, {}>;
export type Hook = BfHandler;

export type HandlerResult =
  | string
  | object
  | GenericException
  | ServerResponse
  | void;

type ZodReturnValue<T extends ZodType> = {
  [K in keyof z.infer<T>]-?: z.infer<T>[K];
} & { status?: number; headers?: Record<string, string> };

export type Handler<T extends ZodRawShape, O extends ZodRawShape> = (
  ctx: Context<ZodObject<T>>
) => HasKeys<O> extends true
  ? Awaitable<ZodReturnValue<ZodObject<O>>>
  : Awaitable<HandlerResult>;

export interface IHandlerConfig<T extends ZodRawShape, O extends ZodRawShape> {
  input?: ZodObject<T>;
  output?: ZodObject<O>;
  action?: Handler<T, O>;
  middleware?: Handler<T, O>[];
}

export interface IHandlers {
  get?: BfHandlerConfig;
  post?: BfHandlerConfig;
  put?: BfHandlerConfig;
  delete?: BfHandlerConfig;
  patch?: BfHandlerConfig;
}

export type NspListener = (nsp: Namespace) => void;

// expected shape of a file(module) all possible exports from route module
export interface IModuleConfig<T> {
  GET?: BfHandler;
  POST?: BfHandler;
  PUT?: BfHandler;
  PATCH?: BfHandler;
  DELETE?: BfHandler;
  listeners?: NspListener;
  afterAll?: BfHandler;
  beforeAll?: BfHandler;
  middleware?: BfHandler[];
  config: IRouteConfig<T>;
  default: ResourceConfig;
  [key: string]: unknown;
}

export interface IRouteConfig<T> {
  /**
   * Define the shape of the model
   *
   * @example
   * ```js
   * {
   *    model: t.model("user", {})
   * }
   * ```
   */
  model?: T;
  /**
   * Define the list of enabled methods. If no custom handlers are defined, handlers will automatically be generated for all enabled methods
   * @type Array<Method>
   * @default ["create"]
   */
  enabledMethods?: Method[];
  /**
   * Define which methods/routes are publicly available without requiring the caller to be authenticated
   */
  securedMethods?: Method[];
}
