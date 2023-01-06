/**
 * Command interface
 */
export interface Command {
    parse(argv: string[]): Promise<string | Error>;
}
/**
 * Commands
 */
export declare type Commands = {
    [command: string]: Command;
};
export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare type GeneratorConfig = {
    output: string | null;
    name: string;
    provider: string;
    config: Dictionary<string>;
    binaryTargets: string[];
    pinnedBinaryTargets?: string | null;
};
export declare type GeneratorOptions = {
    generator: GeneratorConfig;
    otherGenerators: GeneratorConfig[];
    cwd: string;
    dmmf: any;
    datasources: any;
    datamodel: string;
};
export declare type GeneratorFunction = (options: GeneratorOptions) => Promise<string>;
export declare type GeneratorDefinition = {
    prettyName?: string;
    generate: GeneratorFunction;
    defaultOutput: string;
};
export declare type GeneratorDefinitionWithPackage = {
    definition: GeneratorDefinition;
    packagePath: string;
};
export declare type CompiledGeneratorDefinition = {
    prettyName?: string;
    output?: string | null;
    generate: () => Promise<string>;
};
