/// <reference types="node" />
import type { DataSource, GeneratorConfig } from '@prisma/generator-helper';
export declare type QueryEngineEvent = QueryEngineLogEvent | QueryEngineQueryEvent | QueryEnginePanicEvent;
export declare type QueryEngineLogEvent = {
    level: string;
    module_path: string;
    message: string;
};
export declare type QueryEngineQueryEvent = {
    level: 'info';
    module_path: string;
    query: string;
    item_type: 'query';
    params: string;
    duration_ms: string;
    result: string;
};
export declare type QueryEnginePanicEvent = {
    level: 'error';
    module_path: string;
    message: 'PANIC';
    reason: string;
    file: string;
    line: string;
    column: string;
};
export declare type QueryEngineLogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'off';
export declare type QueryEngineConfig = {
    datamodel: string;
    configDir: string;
    logQueries: boolean;
    ignoreEnvVarErrors: boolean;
    datasourceOverrides?: Record<string, string>;
    env: NodeJS.ProcessEnv | Record<string, string>;
    logLevel: QueryEngineLogLevel;
    telemetry?: QueryEngineTelemetry;
};
export declare type QueryEngineTelemetry = {
    enabled: Boolean;
    endpoint: string;
};
export declare type QueryEngineRequest = {
    query: string;
    variables: Object;
};
export declare type QueryEngineResult<T> = {
    data: T;
    elapsed: number;
};
export declare type QueryEngineRequestHeaders = {
    traceparent?: string;
    transactionId?: string;
    fatal?: string;
};
export declare type QueryEngineBatchRequest = {
    batch: QueryEngineRequest[];
    transaction: boolean;
};
export declare type GetConfigOptions = {
    datamodel: string;
    ignoreEnvVarErrors: boolean;
    datasourceOverrides: Record<string, string>;
    env: NodeJS.ProcessEnv | Record<string, string>;
};
export declare type GetDMMFOptions = {
    datamodel: string;
    enableRawQueries: boolean;
};
export declare type SyncRustError = {
    is_panic: boolean;
    message: string;
    meta: {
        full_error: string;
    };
    error_code: string;
};
export declare type RustRequestError = {
    is_panic: boolean;
    message: string;
    backtrace: string;
};
export declare type ConfigMetaFormat = {
    datasources: DataSource[];
    generators: GeneratorConfig[];
    warnings: string[];
};
export declare type ServerInfo = {
    commit: string;
    version: string;
    primaryConnector: string;
};
