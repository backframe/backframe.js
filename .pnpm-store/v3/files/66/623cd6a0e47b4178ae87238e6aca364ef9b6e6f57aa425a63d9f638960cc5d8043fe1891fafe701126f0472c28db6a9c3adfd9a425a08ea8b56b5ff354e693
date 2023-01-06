import execa from 'execa';
export declare enum MigrateEngineExitCode {
    Success = 0,
    Error = 1,
    Panic = 101
}
export interface MigrateEngineLogLine {
    timestamp: string;
    level: LogLevel;
    fields: LogFields;
    target: string;
}
declare type LogLevel = 'INFO' | 'ERROR' | 'DEBUG' | 'WARN';
interface LogFields {
    message: string;
    git_hash?: string;
    is_panic?: boolean;
    error_code?: string;
    [key: string]: any;
}
export declare type DatabaseErrorCodes = 'P1000' | 'P1001' | 'P1002' | 'P1003' | 'P1009' | 'P1010';
export declare type ConnectionResult = true | ConnectionError;
export interface ConnectionError {
    message: string;
    code: DatabaseErrorCodes;
}
export declare function canConnectToDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<ConnectionResult>;
export declare function createDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<boolean>;
export declare function dropDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<boolean>;
export declare function execaCommand({ connectionString, cwd, migrationEnginePath, engineCommandName, }: {
    connectionString: string;
    cwd: string;
    migrationEnginePath?: string;
    engineCommandName: 'create-database' | 'drop-database' | 'can-connect-to-database';
}): Promise<execa.ExecaReturnValue<string>>;
export {};
