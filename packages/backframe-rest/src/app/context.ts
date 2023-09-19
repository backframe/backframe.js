/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BfConfig } from "@backframe/core";
import type { NextFunction } from "express";
import type { ZodObject, ZodRawShape, ZodType, z } from "zod";
import { ExpressReq, ExpressRes, HasKeys, ZodReturnValue } from "../lib/types";

interface IResponseOptions {
  headers?: {
    [key: string]: string | number | string[];
  };
}

export class Context<
  I extends ZodType,
  O extends ZodRawShape = {},
  Q extends ZodType = ZodType<{}>,
  P extends ZodType = ZodType<{}>
> {
  [key: string]: unknown; // extended by user

  constructor(
    public request: ExpressReq,
    public response: ExpressRes,
    public next: NextFunction,
    private bfConfig?: BfConfig
  ) {}

  get db() {
    return this.bfConfig.$database;
  }

  get auth() {
    return {
      session: "",
    };
  }

  get input() {
    return this.request.body as z.infer<I>;
  }

  get query() {
    type QueryParams = HasKeys<Q> extends true ? z.infer<Q> : any;
    return this.request.query as QueryParams;
  }

  get params() {
    type Params = HasKeys<P> extends true ? z.infer<P> : any;
    return this.request.params as Params;
  }

  get config() {
    return this.bfConfig;
  }

  #applyHeaders(options: IResponseOptions) {
    Object.keys(options.headers ?? {}).forEach((h) =>
      this.response.setHeader(h, options.headers[h])
    );
  }

  redirect(url: string) {
    this.response.redirect(url);
  }

  render(
    template: string,
    data: object,
    cb?: (err: Error, html: string) => void
  ) {
    this.response.render(template, data, cb);
  }

  string(value: string, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).send(value);
  }

  json(
    json: HasKeys<O> extends true ? ZodReturnValue<ZodObject<O>> : object,
    status = 200,
    options?: IResponseOptions
  ) {
    this.#applyHeaders(options || {});
    return { ...json, statusCode: status, headers: options?.headers || {} };
  }

  file(contents: string, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).send(contents);
  }
}
