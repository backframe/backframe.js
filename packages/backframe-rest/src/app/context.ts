import type { BfConfig } from "@backframe/core";
import type {
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import type { z, ZodType } from "zod";

interface IResponseOptions {
  headers?: {
    [key: string]: string | number | string[];
  };
}

export class Context<T extends ZodType> {
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

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  next(): any {
    return this._next();
  }

  get input() {
    return this.req.body as z.infer<T>;
  }

  get params(): object {
    // TODO: typed params
    return this.req.params;
  }

  get query(): object {
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
