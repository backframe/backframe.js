import { BfConfig } from "@backframe/core";
import { resolveCwd } from "@backframe/utils";
import {
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import pkg from "glob";
import path from "path";
const { glob } = pkg;

interface IResponseOptions {
  headers?: {
    [key: string]: string | number | string[];
  };
}

export function createContext(
  req: ExpressReq,
  res: ExpressRes,
  next: NextFunction,
  _cfg?: BfConfig
) {
  const ctx = new Context(req, res, next, _cfg);
  return ctx;
}

export class Context {
  constructor(
    private req: ExpressReq,
    private res: ExpressRes,
    private _next: NextFunction,
    private _bfConfig?: BfConfig
  ) {}

  getReq(): ExpressReq {
    return this.req;
  }

  getRes() {
    return this.res;
  }

  next(): any {
    return this._next();
  }

  get input() {
    // TODO: return typed value
    return this.req.body;
  }

  get params(): any {
    // TODO: typed params
    return this.req.params;
  }

  get query(): any {
    return this.req.query;
  }

  private _applyHeaders(options: IResponseOptions) {
    Object.keys(options.headers ?? {}).forEach((h) =>
      this.res.setHeader(h, options.headers![h])
    );
  }

  string(value: string, status = 200, options?: IResponseOptions) {
    this._applyHeaders(options || {});
    return this.res.status(status).send(value);
  }

  json(json: object, status = 200, options?: IResponseOptions) {
    this._applyHeaders(options || {});
    return this.res.status(status).json(json);
  }

  file(contents: string, status = 200, options?: IResponseOptions) {
    this._applyHeaders(options || {});
    return this.res.status(status).send(contents);
  }

  redirect() {}
  rewrite() {}

  render(name: string, _data?: object) {
    const src = this._bfConfig!.getFileSource() ?? "src";
    const file = resolveCwd(path.join(src, "views", `${name}.js`));
    const module = require(file);
    const contents = module.default(_data);

    return this.res.send(contents);
  }
}
