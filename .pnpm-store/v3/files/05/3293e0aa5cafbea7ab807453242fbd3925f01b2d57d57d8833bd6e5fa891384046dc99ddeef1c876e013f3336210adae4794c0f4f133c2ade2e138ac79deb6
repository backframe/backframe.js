import { GeneratorOptions, GeneratorManifest, BinaryPaths, GeneratorConfig } from '@prisma/generator-helper';
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
}
