import {
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";

interface IResponseOptions {
  headers?: {
    [key: string]: string | number | string[];
  };
}

export function createContext(
  req: ExpressReq,
  res: ExpressRes,
  next: NextFunction,
  _model?: any
) {
  const ctx = new Context(req, res, next);
  return ctx;
}

export class Context {
  constructor(
    private req: ExpressReq,
    private res: ExpressRes,
    private _next: NextFunction
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
}
