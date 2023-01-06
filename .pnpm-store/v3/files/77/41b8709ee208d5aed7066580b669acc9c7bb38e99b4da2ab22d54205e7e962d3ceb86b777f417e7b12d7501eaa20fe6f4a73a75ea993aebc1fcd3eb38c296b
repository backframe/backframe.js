import type { PrismaClientRustErrorArgs } from './types/PrismaClientRustErrorArgs';
/**
 * A generic Prisma Client Rust error.
 * This error is being exposed via the `prisma.$on('error')` interface
 */
export declare class PrismaClientRustError extends Error {
    clientVersion: string;
    constructor({ clientVersion, log, error }: PrismaClientRustErrorArgs);
    get [Symbol.toStringTag](): string;
}
