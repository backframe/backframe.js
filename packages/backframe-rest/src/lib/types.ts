/* eslint-disable @typescript-eslint/ban-types */

import type { Request, Response } from "express";
import { ServerResponse } from "http";
import { Namespace } from "socket.io";
import { ZodObject, ZodRawShape } from "zod";
import { Context } from "../app/context.js";
import { ResourceConfig } from "../app/handlers.js";
import { GenericException } from "./errors.js";

export type Method = "get" | "post" | "put" | "patch" | "delete";
export type MethodUpper = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ExpressReq<S = Request> = S & { [key: string]: unknown };
export type ExpressRes<S = Response> = S & { [key: string]: unknown };

export type HandlerResult =
  | string
  | object
  | GenericException
  | ServerResponse
  | void;

export type Hook = H;
export type Handler<U, T extends ZodRawShape> = (
  ctx: Context<U, ZodObject<T>>
) => HandlerResult | Promise<HandlerResult>;

export interface IHandlerConfig<
  T extends ZodRawShape,
  O extends ZodRawShape = {}
> {
  input?: ZodObject<T>;
  output?: ZodObject<O>;
  action: Handler<unknown, T>;
  middleware?: Handler<unknown, T>[];
}

export interface IHandlers {
  get?: IHandlerConfig<{}>;
  post?: IHandlerConfig<{}>;
  put?: IHandlerConfig<{}>;
  delete?: IHandlerConfig<{}>;
  patch?: IHandlerConfig<{}>;
}

export type H = Handler<unknown, {}>;
export type NspListener = (nsp: Namespace) => void;

// expected shape of a file(module) all possible exports from route module
export interface IModuleConfig<T> {
  GET?: H;
  POST?: H;
  PUT?: H;
  PATCH?: H;
  DELETE?: H;
  listeners?: NspListener;
  afterAll?: H;
  beforeAll?: H;
  middleware?: H[];
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
