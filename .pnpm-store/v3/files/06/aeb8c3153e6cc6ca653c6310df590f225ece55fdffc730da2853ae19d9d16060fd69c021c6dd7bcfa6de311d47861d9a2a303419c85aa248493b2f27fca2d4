import { Platform } from '@prisma/get-platform';
export declare enum BinaryType {
    queryEngine = "query-engine",
    libqueryEngine = "libquery-engine",
    migrationEngine = "migration-engine",
    introspectionEngine = "introspection-engine",
    prismaFmt = "prisma-fmt"
}
export declare type BinaryDownloadConfiguration = {
    [binary in BinaryType]?: string;
};
export declare type BinaryPaths = {
    [binary in BinaryType]?: {
        [binaryTarget in Platform]: string;
    };
};
export interface DownloadOptions {
    binaries: BinaryDownloadConfiguration;
    binaryTargets?: Platform[];
    showProgress?: boolean;
    progressCb?: (progress: number) => void;
    version?: string;
    skipDownload?: boolean;
    failSilent?: boolean;
    ignoreCache?: boolean;
    printVersion?: boolean;
}
export declare function download(options: DownloadOptions): Promise<BinaryPaths>;
export declare function getVersion(enginePath: string): Promise<string>;
export declare function checkVersionCommand(enginePath: string): Promise<boolean>;
export declare function getBinaryName(binaryName: string, platform: Platform): string;
export declare function getBinaryEnvVarPath(binaryName: string): string | null;
export declare function maybeCopyToTmp(file: string): Promise<string>;
export declare function plusX(file: any): void;
