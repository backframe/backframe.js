import { Check } from '../check';
declare type Subset<_T extends U, U> = U;
declare type ConfigInput = Subset<Check.State, {
    cache_file: string;
}>;
export declare class Config {
    private readonly state;
    private readonly defaultSchema;
    static new(state: ConfigInput, schema?: Check.Cache): Promise<Config>;
    constructor(state: ConfigInput, defaultSchema: Check.Cache);
    checkCache(newState: Check.State): Promise<{
        cache: Check.Cache | undefined;
        stale: boolean;
    }>;
    set(update: Partial<Check.Cache>): Promise<void>;
    all(): Promise<Check.Cache | undefined>;
    get<K extends keyof Check.Cache>(key: K): Promise<Check.Cache[K] | undefined>;
    reset(): Promise<void>;
    delete(): Promise<void>;
}
export {};
