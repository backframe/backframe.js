import type { DataSource, GeneratorConfig } from '@prisma/generator-helper';
export interface ConfigMetaFormat {
    datasources: DataSource[] | [];
    generators: GeneratorConfig[] | [];
    warnings: string[] | [];
}
export declare type GetConfigOptions = {
    datamodel: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    ignoreEnvVarErrors?: boolean;
};
declare type GetConfigErrorInit = {
    reason: string;
    message: string;
} & ({
    readonly _tag: 'parsed';
    errorCode?: string;
} | {
    readonly _tag: 'unparsed';
});
export declare class GetConfigError extends Error {
    constructor(params: GetConfigErrorInit);
}
export declare function getConfig(options: GetConfigOptions): Promise<ConfigMetaFormat>;
export {};
