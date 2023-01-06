import { ExecaError } from 'execa';
export declare class RustPanic extends Error {
    readonly __typename = "RustPanic";
    request: any;
    rustStack: string;
    area: ErrorArea;
    schemaPath?: string;
    schema?: string;
    introspectionUrl?: string;
    constructor(message: string, rustStack: string, request: any, area: ErrorArea, schemaPath?: string, schema?: string, introspectionUrl?: string);
}
export declare function isRustPanic(e: Error): e is RustPanic;
export declare enum ErrorArea {
    LIFT_CLI = "LIFT_CLI",
    PHOTON_STUDIO = "PHOTON_STUDIO",
    INTROSPECTION_CLI = "INTROSPECTION_CLI",
    FMT_CLI = "FMT_CLI",
    QUERY_ENGINE_BINARY_CLI = "QUERY_ENGINE_BINARY_CLI",
    QUERY_ENGINE_LIBRARY_CLI = "QUERY_ENGINE_LIBRARY_CLI"
}
/**
 * @param error error thrown by execa
 * @returns true if the given error is caused by a panic on a Rust binary.
 */
export declare function isExecaErrorCausedByRustPanic<E extends ExecaError>(error: E): boolean;
