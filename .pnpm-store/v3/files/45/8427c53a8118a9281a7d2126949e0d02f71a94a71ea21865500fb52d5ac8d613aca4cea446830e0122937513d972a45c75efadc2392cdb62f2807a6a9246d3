/// <reference types="node" />
import { Client, Pool } from 'undici';
import { URL } from 'url';
export declare type Result<R> = {
    statusCode: Client.ResponseData['statusCode'];
    headers: Client.ResponseData['headers'];
    data: R;
};
/**
 * Open an HTTP connection pool
 */
export declare class Connection {
    private _pool;
    constructor();
    /**
     * Wrapper to handle HTTP error codes. HTTP errors don't trigger any
     * execptions because it is optional to handle error status codes.
     * @param response to handle
     * @param handler to execute
     * @returns
     */
    static onHttpError<R, HR>(response: Promise<Result<R>>, handler: (result: Result<R>) => HR): Promise<HR | Result<R>>;
    /**
     * Initiates a new connection pool
     * @param url
     * @param options
     * @returns
     */
    open(url: string | URL, options?: Pool.Options): void;
    /**
     * Perform a request
     * @param method
     * @param endpoint
     * @param headers
     * @param body
     * @returns
     */
    raw<R>(method: 'POST' | 'GET', endpoint: string, headers?: Client.DispatchOptions['headers'], body?: Client.DispatchOptions['body']): Promise<Result<R>>;
    /**
     * Perform a POST request
     * @param endpoint
     * @param body
     * @param headers
     * @returns
     */
    post<R>(endpoint: string, body?: Client.DispatchOptions['body'], headers?: Client.DispatchOptions['headers']): Promise<Result<R>>;
    /**
     * Perform a GET request
     * @param endpoint
     * @param body
     * @param headers
     * @returns
     */
    get<R>(path: string, headers?: Client.DispatchOptions['headers']): Promise<Result<R>>;
    /**
     * Close the connections
     */
    close(): void;
}
