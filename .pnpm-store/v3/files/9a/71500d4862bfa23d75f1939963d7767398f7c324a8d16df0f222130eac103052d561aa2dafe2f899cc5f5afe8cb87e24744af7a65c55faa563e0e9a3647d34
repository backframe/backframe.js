import { DMMF } from '@prisma/generator-helper';
import type { Platform } from '@prisma/get-platform';
import type { EngineConfig, EngineEventType } from '../common/Engine';
import { Engine } from '../common/Engine';
import { Metrics, MetricsOptionsJson, MetricsOptionsPrometheus } from '../common/types/Metrics';
import type { ConfigMetaFormat, QueryEngineLogLevel, QueryEngineRequestHeaders, QueryEngineResult } from '../common/types/QueryEngine';
import type * as Tx from '../common/types/Transaction';
import type { LibraryLoader } from './types/Library';
export declare class LibraryEngine extends Engine {
    private engine?;
    private libraryInstantiationPromise?;
    private libraryStartingPromise?;
    private libraryStoppingPromise?;
    private libraryStarted;
    private executingQueryPromise?;
    private config;
    private QueryEngineConstructor?;
    private libraryLoader;
    private library?;
    private logEmitter;
    libQueryEnginePath?: string;
    platform?: Platform;
    datasourceOverrides: Record<string, string>;
    datamodel: string;
    logQueries: boolean;
    logLevel: QueryEngineLogLevel;
    lastQuery?: string;
    loggerRustPanic?: any;
    beforeExitListener?: (args?: any) => any;
    versionInfo?: {
        commit: string;
        version: string;
    };
    constructor(config: EngineConfig, loader?: LibraryLoader);
    private checkForTooManyEngines;
    transaction(action: 'start', options?: Tx.Options): Promise<Tx.Info>;
    transaction(action: 'commit', info: Tx.Info): Promise<undefined>;
    transaction(action: 'rollback', info: Tx.Info): Promise<undefined>;
    private instantiateLibrary;
    private getPlatform;
    private parseEngineResponse;
    private convertDatasources;
    private loadEngine;
    private logger;
    private getErrorMessageWithLink;
    private parseInitError;
    private parseRequestError;
    on(event: EngineEventType, listener: (args?: any) => any): void;
    runBeforeExit(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getConfig(): Promise<ConfigMetaFormat>;
    getDmmf(): Promise<DMMF.Document>;
    version(): string;
    /**
     * Triggers an artificial panic
     */
    debugPanic(message?: string): Promise<never>;
    request<T>(query: string, headers?: QueryEngineRequestHeaders, numTry?: number): Promise<{
        data: T;
        elapsed: number;
    }>;
    requestBatch<T>(queries: string[], headers?: QueryEngineRequestHeaders, transaction?: boolean, numTry?: number): Promise<QueryEngineResult<T>[]>;
    private buildQueryError;
    metrics(options: MetricsOptionsJson): Promise<Metrics>;
    metrics(options: MetricsOptionsPrometheus): Promise<string>;
}
