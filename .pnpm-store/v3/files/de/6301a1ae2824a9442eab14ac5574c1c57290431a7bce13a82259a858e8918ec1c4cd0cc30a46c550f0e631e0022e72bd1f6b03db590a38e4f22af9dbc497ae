import type { NodeAPILibraryTypes } from '@prisma/engine-core';
import * as TE from 'fp-ts/TaskEither';
export declare function preliminaryNodeAPIPipeline(options: {
    prismaPath?: string;
}): TE.TaskEither<{
    type: "query-engine-unresolved";
    reason: string;
    error: Error;
} | {
    type: "node-api-not-supported";
    reason: string;
    error: Error;
}, {
    queryEnginePath: string;
}>;
export declare function preliminaryBinaryPipeline(options: {
    prismaPath?: string;
    datamodelPath?: string;
    datamodel?: string;
}): TE.TaskEither<{
    type: "query-engine-unresolved";
    reason: string;
    error: Error;
} | {
    type: "datamodel-write";
    reason: string;
    error: Error;
}, {
    queryEnginePath: string;
    tempDatamodelPath: string;
}>;
export declare function loadNodeAPILibrary(queryEnginePath: string): TE.TaskEither<{
    type: "connection-error";
    reason: string;
    error: Error;
}, {
    NodeAPIQueryEngineLibrary: NodeAPILibraryTypes.Library;
}>;
export declare function unlinkTempDatamodelPath(options: {
    datamodelPath?: string;
}, tempDatamodelPath: string | undefined): TE.TaskEither<{
    type: string;
    reason: string;
    error: unknown;
}, void>;
export declare const createDebugErrorType: (debug: (formatter: any, ...args: any[]) => void, fnName: string) => ({ type, reason, error }: {
    type: string;
    reason: string;
    error: Error;
}) => void;
