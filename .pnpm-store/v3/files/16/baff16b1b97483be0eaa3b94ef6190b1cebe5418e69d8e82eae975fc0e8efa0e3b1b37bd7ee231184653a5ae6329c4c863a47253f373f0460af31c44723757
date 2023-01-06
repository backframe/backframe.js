import type { Options as OraOptions } from 'ora';
/**
 * Methods available to a spinner instance that has already started.
 */
export interface SpinnerStarted {
    success(text?: string): void;
    failure(text?: string): void;
}
/**
 * Closure that starts a spinner if `enableOutput` is true, and returns a `SpinnerStarted` instance.
 * Note: the spinner will only be enabled if the stream is being run inside a TTY context (not spawned or piped) and/or not in a CI environment.
 * @param enableOutput Whether to enable or disable any output. Useful e.g. for "--print" flags in commands.
 * @param oraOptions Additional options to pass to `ora` for customizing the spinner.
 * @returns
 */
export declare function createSpinner(enableOutput?: boolean, oraOptions?: Partial<OraOptions>): (text: string) => SpinnerStarted;
