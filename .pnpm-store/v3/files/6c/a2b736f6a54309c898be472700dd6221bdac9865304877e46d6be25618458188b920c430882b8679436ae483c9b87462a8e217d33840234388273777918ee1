export interface PrismaClientErrorInfo {
    clientVersion: string;
    cause?: Error;
}
export declare abstract class PrismaClientError extends Error {
    abstract name: string;
    abstract code: string;
    clientVersion: string;
    cause?: Error;
    constructor(message: string, info: PrismaClientErrorInfo);
    get [Symbol.toStringTag](): string;
}
