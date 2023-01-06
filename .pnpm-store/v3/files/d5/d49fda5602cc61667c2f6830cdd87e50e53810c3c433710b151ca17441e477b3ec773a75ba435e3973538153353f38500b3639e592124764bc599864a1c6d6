/**
 * Async
 */
export declare function getSchemaPath(schemaPathFromArgs?: string, opts?: {
    cwd: string;
}): Promise<string | null>;
export declare function getSchemaPathInternal(schemaPathFromArgs?: string, opts?: {
    cwd: string;
}): Promise<string | null>;
export declare type PrismaConfig = {
    schema?: string;
    seed?: string;
};
export declare function getPrismaConfigFromPackageJson(cwd: string): Promise<{
    data: PrismaConfig | undefined;
    packagePath: string;
} | null>;
export declare function getSchemaPathFromPackageJson(cwd: string): Promise<string | null>;
export declare function getRelativeSchemaPath(cwd: string): Promise<string | null>;
/**
 * Small helper that returns the directory which contains the `schema.prisma` file
 */
export declare function getSchemaDir(schemaPathFromArgs?: string): Promise<string | null>;
export declare function getSchema(schemaPathFromArgs?: string): Promise<string>;
/**
 * Sync
 */
export declare function getSchemaPathSync(schemaPathFromArgs?: string): string | null;
export declare function getSchemaPathSyncInternal(schemaPathFromArgs?: string, opts?: {
    cwd: string;
}): string | null;
export declare function getSchemaPathFromPackageJsonSync(cwd: string): string | null;
/**
 * Sync version of the small helper that returns the directory which contains the `schema.prisma` file
 */
export declare function getSchemaDirSync(schemaPathFromArgs?: string): string | null;
export declare function getSchemaSync(schemaPathFromArgs?: string): string;
