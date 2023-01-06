export declare type EnvPaths = {
    rootEnvPath: string | null;
    schemaEnvPath: string | undefined;
};
/**
 *  1. Search in project root
 *  1. Schema
 *    1. Search location from schema arg `--schema`
 *    1. Search location from pkgJSON `"prisma": {"schema": "/path/to/schema.prisma"}`
 *    1. Search default location `./prisma/.env`
 *    1. Search cwd `./.env`
 *
 * @returns `{ rootEnvPath, schemaEnvPath }`
 */
export declare function getEnvPaths(schemaPath?: string | null, opts?: {
    cwd: string;
}): EnvPaths;
