export declare namespace DMMF {
    interface Document {
        datamodel: Datamodel;
        schema: Schema;
        mappings: Mappings;
    }
    interface Mappings {
        modelOperations: ModelMapping[];
        otherOperations: {
            read: string[];
            write: string[];
        };
    }
    interface OtherOperationMappings {
        read: string[];
        write: string[];
    }
    interface DatamodelEnum {
        name: string;
        values: EnumValue[];
        dbName?: string | null;
        documentation?: string;
    }
    interface SchemaEnum {
        name: string;
        values: string[];
    }
    interface EnumValue {
        name: string;
        dbName: string | null;
    }
    interface Datamodel {
        models: Model[];
        enums: DatamodelEnum[];
        types: Model[];
    }
    interface uniqueIndex {
        name: string;
        fields: string[];
    }
    interface PrimaryKey {
        name: string | null;
        fields: string[];
    }
    interface Model {
        name: string;
        dbName: string | null;
        fields: Field[];
        fieldMap?: Record<string, Field>;
        uniqueFields: string[][];
        uniqueIndexes: uniqueIndex[];
        documentation?: string;
        primaryKey: PrimaryKey | null;
        [key: string]: any;
    }
    type FieldKind = 'scalar' | 'object' | 'enum' | 'unsupported';
    type FieldNamespace = 'model' | 'prisma';
    type FieldLocation = 'scalar' | 'inputObjectTypes' | 'outputObjectTypes' | 'enumTypes';
    interface Field {
        kind: FieldKind;
        name: string;
        isRequired: boolean;
        isList: boolean;
        isUnique: boolean;
        isId: boolean;
        isReadOnly: boolean;
        isGenerated?: boolean;
        isUpdatedAt?: boolean;
        /**
         * Describes the data type in the same the way is is defined in the Prisma schema:
         * BigInt, Boolean, Bytes, DateTime, Decimal, Float, Int, JSON, String, $ModelName
         */
        type: string;
        dbNames?: string[] | null;
        hasDefaultValue: boolean;
        default?: FieldDefault | FieldDefaultScalar | FieldDefaultScalar[];
        relationFromFields?: string[];
        relationToFields?: any[];
        relationOnDelete?: string;
        relationName?: string;
        documentation?: string;
        [key: string]: any;
    }
    interface FieldDefault {
        name: string;
        args: any[];
    }
    type FieldDefaultScalar = string | boolean | number;
    interface Schema {
        rootQueryType?: string;
        rootMutationType?: string;
        inputObjectTypes: {
            model?: InputType[];
            prisma: InputType[];
        };
        outputObjectTypes: {
            model: OutputType[];
            prisma: OutputType[];
        };
        enumTypes: {
            model?: SchemaEnum[];
            prisma: SchemaEnum[];
        };
    }
    interface Query {
        name: string;
        args: SchemaArg[];
        output: QueryOutput;
    }
    interface QueryOutput {
        name: string;
        isRequired: boolean;
        isList: boolean;
    }
    type ArgType = string | InputType | SchemaEnum;
    interface SchemaArgInputType {
        isList: boolean;
        type: ArgType;
        location: FieldLocation;
        namespace?: FieldNamespace;
    }
    interface SchemaArg {
        name: string;
        comment?: string;
        isNullable: boolean;
        isRequired: boolean;
        inputTypes: SchemaArgInputType[];
        deprecation?: Deprecation;
    }
    interface OutputType {
        name: string;
        fields: SchemaField[];
        fieldMap?: Record<string, SchemaField>;
    }
    interface SchemaField {
        name: string;
        isNullable?: boolean;
        outputType: {
            type: string | OutputType | SchemaEnum;
            isList: boolean;
            location: FieldLocation;
            namespace?: FieldNamespace;
        };
        args: SchemaArg[];
        deprecation?: Deprecation;
        documentation?: string;
    }
    interface Deprecation {
        sinceVersion: string;
        reason: string;
        plannedRemovalVersion?: string;
    }
    interface InputType {
        name: string;
        constraints: {
            maxNumFields: number | null;
            minNumFields: number | null;
        };
        fields: SchemaArg[];
        fieldMap?: Record<string, SchemaArg>;
    }
    interface ModelMapping {
        model: string;
        plural: string;
        findUnique?: string | null;
        findFirst?: string | null;
        findMany?: string | null;
        create?: string | null;
        createMany?: string | null;
        update?: string | null;
        updateMany?: string | null;
        upsert?: string | null;
        delete?: string | null;
        deleteMany?: string | null;
        aggregate?: string | null;
        groupBy?: string | null;
        count?: string | null;
        findRaw?: string | null;
        aggregateRaw?: string | null;
    }
    enum ModelAction {
        findUnique = "findUnique",
        findFirst = "findFirst",
        findMany = "findMany",
        create = "create",
        createMany = "createMany",
        update = "update",
        updateMany = "updateMany",
        upsert = "upsert",
        delete = "delete",
        deleteMany = "deleteMany",
        groupBy = "groupBy",
        count = "count",
        aggregate = "aggregate",
        findRaw = "findRaw",
        aggregateRaw = "aggregateRaw"
    }
}
