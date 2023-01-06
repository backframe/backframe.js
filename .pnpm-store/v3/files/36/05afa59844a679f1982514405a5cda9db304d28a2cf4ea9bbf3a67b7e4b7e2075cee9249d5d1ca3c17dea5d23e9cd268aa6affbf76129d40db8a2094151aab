export declare type LogLevel = 'info' | 'trace' | 'debug' | 'warn' | 'error' | 'query';
export interface RawRustLog {
    timestamp: string;
    level: LogLevel;
    target: string;
    fields: LogFields;
}
export interface RustLog {
    timestamp: Date;
    level: LogLevel;
    target: string;
    fields: LogFields;
}
export interface RustError {
    is_panic: boolean;
    message: string;
    backtrace?: string;
}
export declare function getMessage(log: string | RustLog | RustError | any): string;
export declare function getBacktraceFromLog(log: RustLog): string;
export declare function getBacktraceFromRustError(err: RustError): string;
export declare function isRustLog(e: any): e is RustLog;
export declare function isRustErrorLog(e: any): e is RustLog;
export declare function isRustError(e: any): e is RustError;
export declare type LogFields = {
    [key: string]: any;
};
export interface PanicLogFields {
    message: 'PANIC';
    reason: string;
    file: string;
    line: string;
    column: number;
}
export interface InfoLogFields {
    message: string;
    'log.target': string;
    'log.module_path': string;
    'log.file': string;
    'log.line': number;
}
export interface QueryLogFields {
    query: string;
    item_type: string;
    params: string;
    duration_ms: number;
}
export interface Log {
    message: string;
    level: LogLevel;
    date: Date;
    application: string;
    [key: string]: string | Date;
}
export declare function convertLog(rustLog: RawRustLog): RustLog;
