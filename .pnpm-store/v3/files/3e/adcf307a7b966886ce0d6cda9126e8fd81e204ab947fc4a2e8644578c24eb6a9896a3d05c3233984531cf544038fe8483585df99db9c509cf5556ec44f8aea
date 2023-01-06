import type { DMMF } from './dmmf';
export declare namespace JsonRPC {
    type Request = {
        jsonrpc: '2.0';
        method: string;
        params?: any;
        id: number;
    };
    type Response = SuccessResponse | ErrorResponse;
    type SuccessResponse = {
        jsonrpc: '2.0';
        result: any;
        id: number;
    };
    type ErrorResponse = {
        jsonrpc: '2.0';
        error: {
            code: number;
            message: string;
            data: any;
        };
        id: number;
    };
}
export declare type Dictionary<T> = {
    [key: string]: T;
};
export interface GeneratorConfig {
    name: string;
    output: EnvValue | null;
    isCustomOutput?: boolean;
    provider: EnvValue;
    config: Dictionary<string>;
    binaryTargets: BinaryTargetsEnvValue[];
    previewFeatures: string[];
}
export interface EnvValue {
    fromEnvVar: null | string;
    value: string;
}
export interface BinaryTargetsEnvValue {
    fromEnvVar: null | string;
    value: string;
}
export declare type ConnectorType = 'mysql' | 'mongodb' | 'sqlite' | 'postgresql' | 'sqlserver' | 'jdbc:sqlserver' | 'cockroachdb';
export interface DataSource {
    name: string;
    activeProvider: ConnectorType;
    provider: ConnectorType;
    url: EnvValue;
    config: {
        [key: string]: string;
    };
}
export declare type BinaryPaths = {
    migrationEngine?: {
        [binaryTarget: string]: string;
    };
    queryEngine?: {
        [binaryTarget: string]: string;
    };
    libqueryEngine?: {
        [binaryTarget: string]: string;
    };
    introspectionEngine?: {
        [binaryTarget: string]: string;
    };
    prismaFmt?: {
        [binaryTarget: string]: string;
    };
};
/** The options passed to the generator implementations */
export declare type GeneratorOptions = {
    generator: GeneratorConfig;
    otherGenerators: GeneratorConfig[];
    schemaPath: string;
    dmmf: DMMF.Document;
    datasources: DataSource[];
    datamodel: string;
    version: string;
    binaryPaths?: BinaryPaths;
    dataProxy: boolean;
};
export declare type EngineType = 'queryEngine' | 'libqueryEngine' | 'migrationEngine' | 'introspectionEngine' | 'prismaFmt';
export declare type GeneratorManifest = {
    prettyName?: string;
    defaultOutput?: string;
    denylists?: {
        models?: string[];
        fields?: string[];
    };
    requiresGenerators?: string[];
    requiresEngines?: EngineType[];
    version?: string;
    requiresEngineVersion?: string;
};
