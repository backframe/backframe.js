import dotenv from 'dotenv';
declare type DotenvResult = dotenv.DotenvConfigOutput & {
    ignoreProcessEnv?: boolean | undefined;
};
interface LoadEnvResult {
    message: string;
    path: string;
    dotenvResult: DotenvResult;
}
export declare function tryLoadEnvs({ rootEnvPath, schemaEnvPath, }: {
    rootEnvPath: string | null | undefined;
    schemaEnvPath: string | null | undefined;
}, opts?: {
    conflictCheck: 'warn' | 'error' | 'none';
}): void | {
    message: string;
    parsed: {
        [x: string]: string;
    };
};
export declare function loadEnv(envPath: string | null | undefined): LoadEnvResult | null;
export declare function pathsEqual(path1: string | null | undefined, path2: string | null | undefined): boolean | "" | null | undefined;
export declare function exists(p: string | null | undefined): p is string;
export {};
