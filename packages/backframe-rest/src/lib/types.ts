/* eslint-disable @typescript-eslint/ban-types */

import { ServerResponse } from "http";
import { ZodObject, ZodRawShape } from "zod";
import { Context } from "../app/context.js";
import { ResourceModule } from "../app/handlers.js";
import { GenericException } from "./errors.js";

export type Method = "get" | "post" | "put" | "patch" | "delete";

export type HandlerResult = string | object | GenericException | ServerResponse;

export type Handler<U, T extends ZodRawShape> = (
  ctx: Context<U, ZodObject<T>>
) => HandlerResult | Promise<HandlerResult>;

export interface IHandlerConfig<T extends ZodRawShape> {
  input?: ZodObject<T>;
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

// expected shape of a file(module)
export interface IModuleConfig<T> {
  config: IRouteConfig<T>;
  default: ResourceModule;
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
