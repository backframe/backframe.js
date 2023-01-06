import type { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
export interface ConfigMetaFormat {
    datasources: DataSource[];
    generators: GeneratorConfig[];
    warnings: string[];
}
export declare type GetDMMFOptions = {
    datamodel?: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    previewFeatures?: string[];
};
declare type GetDmmfErrorInit = {
    reason: string;
    message: string;
} & ({
    readonly _tag: 'parsed';
    errorCode?: string;
} | {
    readonly _tag: 'unparsed';
});
export declare class GetDmmfError extends Error {
    constructor(params: GetDmmfErrorInit);
}
export declare function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document>;
export {};
