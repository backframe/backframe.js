import { DataSource, GeneratorConfig } from '@prisma/generator-helper';
export interface ConfigMetaFormat {
    datasources: DataSource[];
    generators: GeneratorConfig[];
    warnings: string[];
}
export declare type GetConfigOptions = {
    datamodel: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    ignoreEnvVarErrors?: boolean;
};
export declare class GetConfigError extends Error {
    constructor(message: string);
}
export declare function getConfig(options: GetConfigOptions): Promise<ConfigMetaFormat>;
