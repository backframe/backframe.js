/// <reference types="node" />
import type { Dispatcher, Pool } from 'undici';
import type { URL } from 'url';
export declare type Result<R> = {
    statusCode: Dispatcher.ResponseData['statusCode'];
    headers: Dispatcher.ResponseData['headers'];
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
     * exceptions because it is optional to handle error status codes.
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
     * @param parseResponse
     * @returns
     */
    raw<R>(method: 'POST' | 'GET', endpoint: string, headers?: Dispatcher.DispatchOptions['headers'], body?: Dispatcher.DispatchOptions['body'], parseResponse?: boolean): Promise<Result<R>>;
    /**
     * Perform a POST request
     * @param endpoint
     * @param body
     * @param headers
     * @param parseResponse
     * @returns
     */
    post<R>(endpoint: string, body?: Dispatcher.DispatchOptions['body'], headers?: Dispatcher.DispatchOptions['headers'], parseResponse?: boolean): Promise<Result<R>>;
    /**
     * Perform a GET request
     * @param endpoint
     * @param body
     * @param headers
     * @returns
     */
    get<R>(path: string, headers?: Dispatcher.DispatchOptions['headers']): Promise<Result<R>>;
    /**
     * Close the connections
     */
    close(): void;
}
