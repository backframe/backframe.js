import type { DMMF } from '@prisma/generator-helper';
import type { EngineConfig, EngineEventType, GetConfigResult } from '../common/Engine';
import { Engine } from '../common/Engine';
import { Metrics, MetricsOptionsJson, MetricsOptionsPrometheus } from '../common/types/Metrics';
import type { QueryEngineRequestHeaders, QueryEngineResult } from '../common/types/QueryEngine';
import type * as Tx from '../common/types/Transaction';
export declare type Deferred = {
    resolve: () => void;
    reject: (err: Error) => void;
};
export declare type StopDeferred = {
    resolve: (code: number | null) => void;
    reject: (err: Error) => void;
};
export declare class BinaryEngine extends Engine {
    private logEmitter;
    private showColors;
    private logQueries;
    private logLevel?;
    private env?;
    private flags;
    private port?;
    private enableDebugLogs;
    private allowTriggerPanic;
    private child?;
    private clientVersion?;
    private lastPanic?;
    private globalKillSignalReceived?;
    private startCount;
    private previewFeatures;
    private engineEndpoint?;
    private lastErrorLog?;
    private lastRustError?;
    private socketPath?;
    private getConfigPromise?;
    private getDmmfPromise?;
    private stopPromise?;
    private beforeExitListener?;
    private dirname?;
    private cwd;
    private datamodelPath;
    private prismaPath?;
    private stderrLogs;
    private currentRequestPromise?;
    private platformPromise?;
    private platform?;
    private generator?;
    private incorrectlyPinnedBinaryTarget?;
    private datasources?;
    private startPromise?;
    private versionPromise?;
    private engineStartDeferred?;
    private engineStopDeferred?;
    private connection;
    private lastQuery?;
    private lastVersion?;
    private lastActiveProvider?;
    private activeProvider?;
    /**
     * exiting is used to tell the .on('exit') hook, if the exit came from our script.
     * As soon as the Prisma binary returns a correct return code (like 1 or 0), we don't need this anymore
     */
    constructor({ cwd, datamodelPath, prismaPath, generator, datasources, showColors, logLevel, logQueries, env, flags, clientVersion, previewFeatures, engineEndpoint, enableDebugLogs, allowTriggerPanic, dirname, activeProvider, }: EngineConfig);
    private setError;
    private checkForTooManyEngines;
    private resolveCwd;
    on(event: EngineEventType, listener: (args?: any) => any): void;
    emitExit(): Promise<void>;
    private getPlatform;
    private getQueryEnginePath;
    private handlePanic;
    private resolvePrismaPath;
    private getPrismaPath;
    private getFixedGenerator;
    private printDatasources;
    /**
     * Starts the engine, returns the url that it runs on
     */
    start(): Promise<void>;
    private getEngineEnvVars;
    private internalStart;
    stop(): Promise<void>;
    /**
     * If Prisma runs, stop it
     */
    _stop(): Promise<void>;
    kill(signal: string): void;
    /**
     * Use the port 0 trick to get a new port
     */
    private getFreePort;
    getConfig(): Promise<GetConfigResult>;
    private _getConfig;
    getDmmf(): Promise<DMMF.Document>;
    private _getDmmf;
    version(forceRun?: boolean): Promise<string>;
    internalVersion(): Promise<string>;
    request<T>(query: string, headers?: QueryEngineRequestHeaders, numTry?: number): Promise<QueryEngineResult<T>>;
    requestBatch<T>(queries: string[], headers?: QueryEngineRequestHeaders, transaction?: boolean, numTry?: number): Promise<QueryEngineResult<T>[]>;
    /**
     * Send START, COMMIT, or ROLLBACK to the Query Engine
     * @param action START, COMMIT, or ROLLBACK
     * @param options to change the default timeouts
     * @param info transaction information for the QE
     */
    transaction(action: 'start', options?: Tx.Options): Promise<Tx.Info>;
    transaction(action: 'commit', info: Tx.Info): Promise<undefined>;
    transaction(action: 'rollback', info: Tx.Info): Promise<undefined>;
    private get hasMaxRestarts();
    /**
     * If we have request errors like "ECONNRESET", we need to get the error from a
     * different place, not the request itself. This different place can either be
     * this.lastRustError or this.lastErrorLog
     */
    private throwAsyncErrorIfExists;
    private getErrorMessageWithLink;
    private handleRequestError;
    metrics(options: MetricsOptionsJson): Promise<Metrics>;
    metrics(options: MetricsOptionsPrometheus): Promise<string>;
}
