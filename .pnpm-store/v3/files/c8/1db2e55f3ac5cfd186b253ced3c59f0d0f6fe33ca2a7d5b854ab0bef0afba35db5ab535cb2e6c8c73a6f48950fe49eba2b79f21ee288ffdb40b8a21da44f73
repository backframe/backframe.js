import { O } from 'ts-toolbelt';
/**
 * These are the cli args that we check the data proxy for. If in use
 */
declare const checkedArgs: {
    '--url': boolean;
    '--to-url': boolean;
    '--from-url': boolean;
    '--shadow-database-url': boolean;
    '--schema': boolean;
    '--from-schema-datamodel': boolean;
    '--to-schema-datamodel': boolean;
};
declare type Args = O.Optional<O.Update<typeof checkedArgs, any, string>>;
/**
 * Get the message to display when a command is forbidden with a data proxy flag
 * @param command the cli command (eg. db push)
 * @returns
 */
export declare const forbiddenCmdWithDataProxyFlagMessage: (command: string) => string;
export declare function checkUnsupportedDataProxy(command: string, args: Args, implicitSchema: boolean): Promise<void>;
export {};
