/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request as ExpressReq, Response as ExpressRes } from "express";
import { z, ZodAnyDef } from "zod";

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
      z.object({
        resolve: z.string(),
        options: z.any(),
      }) || z.string()
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
    platform: z.string().optional(),
  }),
});

export type BfConfig = z.infer<typeof BfConfigSchema>;
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

export interface IBfConfigInternal extends BfConfig {
  auth?: any;
  database?: any;
  server?: any;
  metadata?: {
    typescript: boolean;
    fileSrc: string;
  };
  globalMiddleware?: any;
  pluginsOptions?: object;
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
  model?: ZodAnyDef;
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
