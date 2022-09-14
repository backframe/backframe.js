/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, RequestHandler, Response } from "express";

export type BfRequestHandler = (ctx: IHandlerContext) => any;
export type BfConfig = {
  interfaces?: {
    rest?: {
      versioned?: boolean;
      urlPrefix?: string;
    };
    graphql?: {
      mount?: string;
    };
  };
  plugins?: {
    resolve: string;
    options: any;
  }[];
  providers?: {
    provider: string;
    config: any;
  }[];
};

export interface IBfConfigInternal extends BfConfig {
  hasPlugins: () => boolean;
  includesPlugin: (val: string) => any;
  metadata: any;
}

export interface IRouteConfig {
  name: string;
  handlers: {
    get?: BfRequestHandler;
    getOne?: BfRequestHandler;
    post?: BfRequestHandler;
    put?: BfRequestHandler;
    delete?: BfRequestHandler;
  };
  config: IModuleConfig;
}

interface IModuleConfig {
  middleware?: RequestHandler[];
  enabledMethods?: string[];
  publicMethods?: string[];
  options?: any;
  model?: any;
}

export interface IResourceConfig {
  config?: IModuleConfig;
  default: {
    handlers: {
      method: string;
      action: BfRequestHandler;
    }[];
  };
}

export interface IHandlerContext {
  req: Request;
  res: Response;
}
