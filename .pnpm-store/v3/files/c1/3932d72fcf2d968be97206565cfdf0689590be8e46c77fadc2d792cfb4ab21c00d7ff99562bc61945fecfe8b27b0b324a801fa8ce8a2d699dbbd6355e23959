interface LoaderOptions {
    ext?: "mjs" | "js" | "ts";
    format?: "cjs" | "esm";
    declaration?: boolean;
}

interface MkdistOptions extends LoaderOptions {
    rootDir?: string;
    srcDir?: string;
    pattern?: string | string[];
    distDir?: string;
    cleanDist?: boolean;
}
declare function mkdist(options?: MkdistOptions): Promise<{
    writtenFiles: string[];
}>;

export { MkdistOptions, mkdist };
