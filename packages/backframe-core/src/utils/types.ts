/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Express,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import { Server as HttpServer } from "http";
import { z } from "zod";
import { Model } from "../models/index.js";

export const BfConfigSchema = z.object({
  interfaces: z
    .object({
      rest: z
        .object({
          versioned: z.boolean().optional(),
          urlPrefix: z.string().optional(),
        })
        .optional(),
      graphql: z
        .object({
          mount: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  plugins: z
    .array(
      z
        .object({
          resolve: z.string(),
          options: z.any(),
        })
        .or(z.string())
    )
    .optional(),
  providers: z
    .array(
      z.object({
        provider: z.string(),
        config: z.any(),
      })
    )
    .optional(),
  settings: z.object({
    srcDir: z.string(),
    server: z.string().optional(),
    logger: z
      .object({
        level: z.enum(["debug", "info", "warn", "error"]),
        timestamp: z.boolean().optional(),
        format: z
          .function()
          .args(
            z.object({
              level: z.string(),
              message: z.string(),
              timestamp: z.string().optional(),
            })
          )
          .returns(z.string())
          .optional(),
      })
      .optional(),
  }),
});

export type BfUserConfig = z.infer<typeof BfConfigSchema>;
export type BfRequestHandler = (ctx: IHandlerContext) => string | object;
export type MethodName =
  | "get"
  | "getOne"
  | "post"
  | "put"
  | "delete"
  | "options"
  | "patch";
export type MethodNameAlias =
  | "find"
  | "findOne"
  | "create"
  | "updated"
  | "delete";
export type BfResourceConfig = {
  route: string;
  handlers: IResourceHandlers;
  routeConfig: IRouteConfig;
};

export interface IResourceHandlers {
  get?: BfRequestHandler;
  getOne?: BfRequestHandler;
  post?: BfRequestHandler;
  put?: BfRequestHandler;
  delete?: BfRequestHandler;
  options?: BfRequestHandler;
  patch?: BfRequestHandler;
}

type PluginListener = (cfg: IBfConfigInternal) => IBfConfigInternal;
export interface IBfConfigInternal extends BfUserConfig {
  auth?: any;
  database?: any;
  server?: any;
  metadata?: {
    typescript: boolean;
    fileSrc: string;
  };
  globalMiddleware?: any;
  listeners?: {
    _afterLoadConfig: PluginListener[];
    _beforeServerStart: PluginListener[];
    _afterServerStart: PluginListener[];
  };
  getFileSource: () => string;
}

export interface IHandlerContext {
  _req: ExpressReq;
  _res: ExpressRes;
  input: any;
  query: any;
  params: any;
  db: any;
  auth: any;
}

export interface IRouteConfig {
  model?: Model;
  middleware?: BfRequestHandler[];
  enabled?: MethodName[];
  public?: MethodName[];
}

export interface IModuleConfig {
  default: {
    handlers?: {
      method: MethodName;
      action: BfRequestHandler;
      input?: any;
    }[];
  };
  config?: IRouteConfig;
}

export interface IBfServer {
  _app: Express;
  _handle: HttpServer;
  __initialize: (cfg: IBfConfigInternal) => typeof cfg;
  __resolveRoutes: (cfg: IBfConfigInternal) => typeof cfg;
  start: (port?: number) => void | undefined;
  stop: (
    callback?: (err?: Error | undefined) => void | undefined
  ) => void | undefined;
  addResource: (r: BfResourceConfig) => void;
}
