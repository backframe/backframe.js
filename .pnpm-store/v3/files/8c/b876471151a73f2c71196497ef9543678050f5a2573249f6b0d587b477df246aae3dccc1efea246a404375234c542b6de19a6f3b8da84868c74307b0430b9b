import "error-cause/auto";
import { EnumDeclaration, EnumValue, FieldDeclaration, ModelDeclaration, SchemaArgument, SchemaExpression } from "./ast";
export declare type SortOrder = "Asc" | "Desc";
export declare function isSortOrder(v: unknown): v is SortOrder;
export declare function asSortOrder(s: string): SortOrder;
export interface IdFieldAttribute {
    map?: string;
    length?: number;
    sort?: SortOrder;
    clustered?: boolean;
}
export declare function findIdFieldAttribute(decl: FieldDeclaration): IdFieldAttribute | undefined;
export interface IndexField {
    name: string;
    length?: number;
    sort?: SortOrder;
    ops?: string;
}
export interface IdBlockAttribute {
    fields: IndexField[];
    name?: string;
    map?: string;
    clustered?: boolean;
}
export declare function findIdBlockAttribute(decl: ModelDeclaration): IdBlockAttribute | undefined;
export interface DefaultFieldAttribute {
    expression: SchemaExpression;
    map?: string;
}
export declare function findDefaultFieldAttribute(decl: FieldDeclaration): DefaultFieldAttribute | undefined;
export interface UniqueFieldAttribute {
    map?: string;
    length?: number;
    sort?: SortOrder;
    clustered?: boolean;
}
export declare function findUniqueFieldAttribute(decl: FieldDeclaration): UniqueFieldAttribute | undefined;
export interface UniqueBlockAttribute {
    fields: IndexField[];
    name?: string;
    map?: string;
    clustered?: boolean;
}
export declare function findUniqueBlockAttributes(decl: ModelDeclaration): UniqueBlockAttribute[];
export interface IndexBlockAttribute {
    fields: IndexField[];
    name?: string;
    map?: string;
    clustered?: boolean;
    type?: string;
}
export declare function findIndexBlockAttributes(decl: ModelDeclaration): IndexBlockAttribute[];
export declare function readOpsArgument(arg: SchemaArgument): string;
declare const referentialActions: readonly ["Cascade", "Restrict", "NoAction", "SetNull", "SetDefault"];
export declare type ReferentialAction = typeof referentialActions[number];
export declare function isReferentialAction(v: unknown): v is ReferentialAction;
export declare function asReferentialAction(s: string): ReferentialAction;
export interface RelationFieldAttribute {
    name?: string;
    fields?: string[];
    references?: string[];
    onDelete?: ReferentialAction;
    onUpdate?: ReferentialAction;
}
export declare function findRelationFieldAttribute(decl: FieldDeclaration): RelationFieldAttribute | undefined;
export declare function readReferentialActionArgument(arg: SchemaArgument): ReferentialAction;
export interface MapFieldAttribute {
    name: string;
}
export declare function findMapFieldAttribute(decl: FieldDeclaration | EnumValue): MapFieldAttribute | undefined;
export interface MapBlockAttribute {
    name: string;
}
export declare function findMapBlockAttribute(decl: ModelDeclaration | EnumDeclaration): MapBlockAttribute | undefined;
export declare function applyOptional<T, U>(value: T | undefined, fn: (arg: T) => U): U | undefined;
export {};
//# sourceMappingURL=attributes.d.ts.map