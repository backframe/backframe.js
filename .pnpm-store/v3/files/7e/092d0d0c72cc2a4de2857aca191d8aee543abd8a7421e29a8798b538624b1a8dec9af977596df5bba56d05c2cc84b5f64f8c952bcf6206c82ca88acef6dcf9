import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
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
export declare function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document>;
