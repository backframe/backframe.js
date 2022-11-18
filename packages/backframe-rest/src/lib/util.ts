import { Model } from "@backframe/core";
import { Response as ExpressRes } from "express";
import { Context } from "./context.js";
import { ModuleHandlers, _Handler } from "./handlers.js";

export type MethodName = "create" | "read" | "update" | "delete";
export type BfRequestHandler = (
  ctx: Context
) => string | object | string[] | ExpressRes | void;

export interface BfResourceConfig {
  route: string;
  handlers: IResourceHandlers;
  config: IRouteConfig;
}

export interface IModuleConfig {
  config: IRouteConfig;
  default: ModuleHandlers;
}

export interface IResourceHandlers {
  create?: _Handler;
  read?: _Handler;
  update?: _Handler;
  delete?: _Handler;
}

export interface IRouteConfig {
  model?: Model;
  middleware?: BfRequestHandler[];
  enabled?: MethodName[];
  public?: MethodName[];
}

export function _resolveMethod(m: string) {
  if (m === "create") return "post";
  if (m === "read") return "get";
  if (m === "update") return "put";
  return "delete";
}
