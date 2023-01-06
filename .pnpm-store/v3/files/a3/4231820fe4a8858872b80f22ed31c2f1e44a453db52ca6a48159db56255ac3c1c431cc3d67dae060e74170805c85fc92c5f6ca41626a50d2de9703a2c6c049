import { GeneratorOptions, GeneratorManifest, GeneratorConfig } from './types';
export interface Handler {
    onGenerate(options: GeneratorOptions): Promise<any>;
    onManifest?(config: GeneratorConfig): GeneratorManifest;
}
export declare function generatorHandler(handler: Handler): void;
