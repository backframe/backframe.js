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

// eslint-disable-next-line @typescript-eslint/ban-types
export class Context<I extends ZodType, O extends ZodRawShape = {}> {
  [key: string]: unknown; // extended by user

  constructor(
    public request: ExpressReq,
    public response: ExpressRes,
    public next: NextFunction,
    private database?: unknown,
    private bfConfig?: BfConfig
  ) {}

  get db() {
    // TODO: Find a better way for this
    // @ts-expect-error (come from user end)
    return this.database as Database;
  }

  get auth() {
    return {
      session: "",
    };
  }

  get input() {
    return this.request.body as z.infer<I>;
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  get query(): any {
    return this.request.query;
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  get params(): any {
    // TODO: typed params
    return this.request.params;
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
    _status = 200,
    options?: IResponseOptions
  ) {
    this.#applyHeaders(options || {});
    return json;
  }

  file(contents: string, status = 200, options?: IResponseOptions) {
    this.#applyHeaders(options || {});
    return this.response.status(status).send(contents);
  }
}
