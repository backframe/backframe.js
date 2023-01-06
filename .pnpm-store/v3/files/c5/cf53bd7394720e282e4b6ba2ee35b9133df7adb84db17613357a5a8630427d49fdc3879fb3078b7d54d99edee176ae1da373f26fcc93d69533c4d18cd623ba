import type { RequestResponse } from '../utils/request';
import type { DataProxyAPIErrorInfo } from './DataProxyAPIError';
import { DataProxyAPIError } from './DataProxyAPIError';
export interface NotFoundErrorInfo extends DataProxyAPIErrorInfo {
    response: RequestResponse;
}
export declare class NotFoundError extends DataProxyAPIError {
    name: string;
    code: string;
    constructor(info: NotFoundErrorInfo);
}
