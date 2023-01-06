export interface IntrospectionEngineOptions {
    binaryPath?: string;
    debug?: boolean;
    cwd?: string;
}
export interface RPCPayload {
    id: number;
    jsonrpc: string;
    method: string;
    params: any;
}
export declare class IntrospectionPanic extends Error {
    request: any;
    rustStack: string;
    constructor(message: string, rustStack: string, request: any);
}
export declare class IntrospectionError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export declare type IntrospectionWarnings = IntrospectionWarningsUnhandled | IntrospectionWarningsInvalidReintro | IntrospectionWarningsMissingUnique | IntrospectionWarningsEmptyFieldName | IntrospectionWarningsUnsupportedType | IntrospectionWarningsInvalidEnumName | IntrospectionWarningsCuidPrisma1 | IntrospectionWarningsUuidPrisma1 | IntrospectionWarningsFieldModelReintro | IntrospectionWarningsFieldMapReintro | IntrospectionWarningsEnumMapReintro | IntrospectionWarningsEnumValueMapReintro | IntrospectionWarningsCuidReintro | IntrospectionWarningsUuidReintro | IntrospectionWarningsUpdatedAtReintro | IntrospectionWarningsWithoutColumns | IntrospectionWarningsModelsWithIgnoreReintro | IntrospectionWarningsFieldsWithIgnoreReintro | IntrospectionWarningsCustomIndexNameReintro | IntrospectionWarningsCustomPrimaryKeyNamesReintro | IntrospectionWarningsRelationsReintro | IntrospectionWarningsMongoMultipleTypes | IntrospectionWarningsMongoFieldsPointingToAnEmptyType | IntrospectionWarningsMongoFieldsWithUnknownTypes | IntrospectionWarningsMongoFieldsWithEmptyNames;
declare type AffectedModel = {
    model: string;
};
declare type AffectedModelAndIndex = {
    model: string;
    index_db_name: string;
};
declare type AffectedModelAndField = {
    model: string;
    field: string;
};
declare type AffectedModelAndFieldAndType = {
    model: string;
    field: string;
    tpe: string;
};
declare type AffectedModelOrCompositeTypeAndField = {
    compositeType?: string;
    model?: string;
    field: string;
};
declare type AffectedModelOrCompositeTypeAndFieldAndType = AffectedModelOrCompositeTypeAndField & {
    tpe: string;
};
declare type AffectedEnum = {
    enm: string;
};
declare type AffectedEnumAndValue = {
    enm: string;
    value: string;
};
interface IntrospectionWarning {
    code: number;
    message: string;
    affected: AffectedModel[] | AffectedModelAndIndex[] | AffectedModelAndField[] | AffectedModelAndFieldAndType[] | AffectedModelOrCompositeTypeAndField[] | AffectedModelOrCompositeTypeAndFieldAndType[] | AffectedEnum[] | AffectedEnumAndValue[] | null;
}
interface IntrospectionWarningsUnhandled extends IntrospectionWarning {
    code: -1;
    affected: any;
}
interface IntrospectionWarningsInvalidReintro extends IntrospectionWarning {
    code: 0;
    affected: null;
}
interface IntrospectionWarningsMissingUnique extends IntrospectionWarning {
    code: 1;
    affected: AffectedModel[];
}
interface IntrospectionWarningsEmptyFieldName extends IntrospectionWarning {
    code: 2;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsUnsupportedType extends IntrospectionWarning {
    code: 3;
    affected: AffectedModelAndFieldAndType[];
}
interface IntrospectionWarningsInvalidEnumName extends IntrospectionWarning {
    code: 4;
    affected: AffectedEnumAndValue[];
}
interface IntrospectionWarningsCuidPrisma1 extends IntrospectionWarning {
    code: 5;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsUuidPrisma1 extends IntrospectionWarning {
    code: 6;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsFieldModelReintro extends IntrospectionWarning {
    code: 7;
    affected: AffectedModel[];
}
interface IntrospectionWarningsFieldMapReintro extends IntrospectionWarning {
    code: 8;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsEnumMapReintro extends IntrospectionWarning {
    code: 9;
    affected: AffectedEnum[];
}
interface IntrospectionWarningsEnumValueMapReintro extends IntrospectionWarning {
    code: 10;
    affected: AffectedEnum[];
}
interface IntrospectionWarningsCuidReintro extends IntrospectionWarning {
    code: 11;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsUuidReintro extends IntrospectionWarning {
    code: 12;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsUpdatedAtReintro extends IntrospectionWarning {
    code: 13;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsWithoutColumns extends IntrospectionWarning {
    code: 14;
    affected: AffectedModel[];
}
interface IntrospectionWarningsModelsWithIgnoreReintro extends IntrospectionWarning {
    code: 15;
    affected: AffectedModel[];
}
interface IntrospectionWarningsFieldsWithIgnoreReintro extends IntrospectionWarning {
    code: 16;
    affected: AffectedModelAndField[];
}
interface IntrospectionWarningsCustomIndexNameReintro extends IntrospectionWarning {
    code: 17;
    affected: AffectedModelAndIndex[];
}
interface IntrospectionWarningsCustomPrimaryKeyNamesReintro extends IntrospectionWarning {
    code: 18;
    affected: AffectedModel[];
}
interface IntrospectionWarningsRelationsReintro extends IntrospectionWarning {
    code: 19;
    affected: AffectedModel[];
}
interface IntrospectionWarningsMongoMultipleTypes extends IntrospectionWarning {
    code: 101;
    affected: AffectedModelOrCompositeTypeAndFieldAndType[];
}
interface IntrospectionWarningsMongoFieldsPointingToAnEmptyType extends IntrospectionWarning {
    code: 102;
    affected: AffectedModelOrCompositeTypeAndField[];
}
interface IntrospectionWarningsMongoFieldsWithUnknownTypes extends IntrospectionWarning {
    code: 103;
    affected: AffectedModelOrCompositeTypeAndField[];
}
interface IntrospectionWarningsMongoFieldsWithEmptyNames extends IntrospectionWarning {
    code: 104;
    affected: AffectedModelOrCompositeTypeAndField[];
}
export declare type IntrospectionSchemaVersion = 'Prisma2' | 'Prisma1' | 'Prisma11' | 'NonPrisma';
export declare class IntrospectionEngine {
    private debug;
    private cwd;
    private child?;
    private listeners;
    private messages;
    private lastRequest?;
    private lastError?;
    private initPromise?;
    private lastUrl?;
    isRunning: boolean;
    constructor({ debug, cwd }?: IntrospectionEngineOptions);
    stop(): void;
    private rejectAll;
    private registerCallback;
    getDatabaseDescription(schema: string): Promise<string>;
    getDatabaseVersion(schema: string): Promise<string>;
    introspect(schema: string, force?: Boolean, compositeTypeDepth?: number): Promise<{
        datamodel: string;
        warnings: IntrospectionWarnings[];
        version: IntrospectionSchemaVersion;
    }>;
    debugPanic(): Promise<any>;
    listDatabases(schema: string): Promise<string[]>;
    getDatabaseMetadata(schema: string): Promise<{
        size_in_bytes: number;
        table_count: number;
    }>;
    private handleResponse;
    private init;
    private internalInit;
    private runCommand;
    private getRPCPayload;
}
export {};
