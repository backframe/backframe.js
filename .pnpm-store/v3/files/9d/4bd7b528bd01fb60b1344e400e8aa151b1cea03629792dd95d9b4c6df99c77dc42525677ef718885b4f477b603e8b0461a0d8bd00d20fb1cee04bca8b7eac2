/// <reference types="node" />
import { ErrorArea } from './panic';
export declare enum ErrorKind {
    JS_ERROR = "JS_ERROR",
    RUST_PANIC = "RUST_PANIC"
}
export interface CreateErrorReportInput {
    area: ErrorArea;
    binaryVersion: string;
    cliVersion: string;
    command: string;
    jsStackTrace: string;
    kind: ErrorKind;
    liftRequest?: string;
    operatingSystem: string;
    platform: string;
    rustStackTrace: string;
    schemaFile?: string;
    fingerprint?: string;
    sqlDump?: string;
    dbVersion?: string;
}
export declare function uploadZip(zip: Buffer, url: string): Promise<any>;
export declare function createErrorReport(data: CreateErrorReportInput): Promise<string>;
export declare function makeErrorReportCompleted(signedUrl: string): Promise<number>;
