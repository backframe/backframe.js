/* eslint-disable @typescript-eslint/no-explicit-any */
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

export class Context<T extends ZodType, U> {
  constructor(
    public request: ExpressReq,
    public response: ExpressRes,
    public next: NextFunction,
    private _bfConfig?: BfConfig,
    private database?: U
  ) {}

  get input() {
    return this.request.body as z.infer<T>;
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  get params(): any {
    // TODO: typed params
    return this.request.params;
  }

  get query(): object {
    return this.request.query;
  }

  get db(): U {
    return this.database;
  }

  #applyHeaders(options: IResponseOptions) {
    Object.keys(options.headers ?? {}).forEach((h) =>
      this.response.setHeader(h, options.headers[h])
    );
  }

  redirect(url: string) {
    this.response.redirect(url);
  }

  string(value: string, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).send(value);
  }

  json(json: object, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).json(json);
  }

  file(contents: string, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).send(contents);
  }
}
