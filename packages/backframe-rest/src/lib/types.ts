import { ServerResponse } from "http";
import { ZodObject, ZodRawShape } from "zod";
import { Context } from "../app/context.js";
import { ResourceHandlers } from "../app/handlers.js";
import { GenericException } from "./errors.js";

export type Method = "create" | "read" | "update" | "delete";

export type Handler<T extends ZodRawShape> = (
  ctx: Context<ZodObject<T>>
) => string | object | string[] | GenericException | ServerResponse;

export interface IHandlerConfig<T extends ZodRawShape> {
  input?: ZodObject<T>;
  action: Handler<T>;
  middleware?: Handler<T>[];
}

// expected shape of a file(module)
export interface IModuleConfig<T> {
  config: IRouteConfig<T>;
  default: ResourceHandlers;
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
  enabled?: Method[];
  /**
   * Define which methods/routes are publicly available without requiring the caller to be authenticated
   */
  public?: Method[];
}
