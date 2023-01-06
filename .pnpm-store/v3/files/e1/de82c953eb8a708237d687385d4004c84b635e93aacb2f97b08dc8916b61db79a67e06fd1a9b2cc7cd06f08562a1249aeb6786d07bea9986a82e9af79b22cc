import type { RequestResponse } from '../utils/request';
import type { DataProxyErrorInfo } from './DataProxyError';
import { DataProxyError } from './DataProxyError';
export interface DataProxyAPIErrorInfo extends DataProxyErrorInfo {
    response: RequestResponse;
}
export declare abstract class DataProxyAPIError extends DataProxyError {
    response: RequestResponse;
    constructor(message: string, info: DataProxyAPIErrorInfo);
}
