import { PrismaAstNode } from "./ast";
export interface PrismaAstNodeVisitor<T extends PrismaAstNode> {
    enter?(node: T): void;
    leave?(node: T): void;
}
export declare type PrismaAstVisitor = {
    readonly [T in PrismaAstNode as T["kind"]]?: PrismaAstNodeVisitor<T>;
};
export declare function visitAst<T extends PrismaAstNode>(node: T, visitor: PrismaAstVisitor): void;
declare type ReducedField<T, R> = T extends null | undefined ? T : T extends PrismaAstNode ? R : T extends ReadonlyArray<PrismaAstNode> ? ReadonlyArray<R> : T;
declare type ReducedNode<T, R> = {
    [K in keyof T]: ReducedField<T[K], R>;
};
export declare type PrismaAstNodeReducer<T extends PrismaAstNode, R> = (node: ReducedNode<T, R>) => R;
export declare type PrismaAstReducer<R> = {
    readonly [T in PrismaAstNode as T["kind"]]?: PrismaAstNodeReducer<T, R>;
};
export declare function reduceAst<T extends PrismaAstNode, R>(node: T, reducer: PrismaAstReducer<R>): R | undefined;
export {};
//# sourceMappingURL=visit.d.ts.map