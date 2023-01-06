import dotenv from 'dotenv';
declare type DotenvResult = dotenv.DotenvConfigOutput & {
    ignoreProcessEnv?: boolean | undefined;
};
interface DotenvLoadEnvResult {
    message: string;
    path: string;
    dotenvResult: DotenvResult;
}
export declare type LoadedEnv = {
    message?: string;
    parsed: {
        [x: string]: string;
    };
} | undefined;
export declare function tryLoadEnvs({ rootEnvPath, schemaEnvPath, }: {
    rootEnvPath: string | null | undefined;
    schemaEnvPath: string | null | undefined;
}, opts?: {
    conflictCheck: 'warn' | 'error' | 'none';
}): LoadedEnv;
export declare function loadEnv(envPath: string | null | undefined): DotenvLoadEnvResult | null;
export declare function pathsEqual(path1: string | null | undefined, path2: string | null | undefined): boolean | "" | null | undefined;
export declare function exists(p: string | null | undefined): p is string;
export {};
