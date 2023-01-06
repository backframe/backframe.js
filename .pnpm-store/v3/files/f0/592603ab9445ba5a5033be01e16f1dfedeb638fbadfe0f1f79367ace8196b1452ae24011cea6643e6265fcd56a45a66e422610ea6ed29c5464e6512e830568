import type { BinaryPaths, GeneratorConfig, GeneratorManifest, GeneratorOptions } from '@prisma/generator-helper';
export declare class Generator {
    private generatorProcess;
    manifest: GeneratorManifest | null;
    config: GeneratorConfig;
    options?: GeneratorOptions;
    constructor(executablePath: string, config: GeneratorConfig, isNode?: boolean);
    init(): Promise<void>;
    stop(): void;
    generate(): Promise<any>;
    setOptions(options: GeneratorOptions): void;
    setBinaryPaths(binaryPaths: BinaryPaths): void;
    /**
     * Returns the pretty name of the generator specified in the manifest (e.g.,
     * "Prisma Client"), or, if the former is not defined, the generator's
     * provider name (e.g., "prisma-client-js") as a fallback.
     */
    getPrettyName(): string;
    /**
     * Returns the provider name, parsed and resolved from environment variable
     * if necessary.
     */
    getProvider(): string;
}
