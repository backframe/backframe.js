import type { DataProxyAPIErrorInfo } from './DataProxyAPIError';
import { DataProxyAPIError } from './DataProxyAPIError';
export interface ServerErrorInfo extends DataProxyAPIErrorInfo {
}
export declare class ServerError extends DataProxyAPIError {
    name: string;
    code: string;
    logs?: string[];
    constructor(info: ServerErrorInfo, message?: string, logs?: string[]);
}
