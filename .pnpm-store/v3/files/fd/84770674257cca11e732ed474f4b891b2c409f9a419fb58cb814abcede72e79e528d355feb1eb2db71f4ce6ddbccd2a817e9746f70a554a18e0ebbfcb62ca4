export declare type GeneratorPaths = {
    outputPath: string;
    generatorPath: string;
    isNode?: boolean;
};
export declare type GeneratorResolver = (baseDir: string, version?: string) => Promise<GeneratorPaths>;
export declare type PredefinedGeneratorResolvers = {
    [generatorName: string]: GeneratorResolver;
};
export declare const predefinedGeneratorResolvers: PredefinedGeneratorResolvers;
