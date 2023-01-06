/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare namespace Check {
    type Input = {
        product: string;
        version: string;
        project_hash: string;
        cli_path?: string;
        cli_path_hash?: string;
        information?: string;
        command?: string;
        disable?: boolean;
        local_timestamp?: string;
        endpoint?: string;
        timeout?: number;
        arch?: string;
        os?: string;
        node_version?: string;
        ci?: boolean;
        ci_name?: string;
        schema_providers?: string[];
        schema_preview_features?: string[];
        schema_generators_providers?: string[];
        cli_install_type?: 'local' | 'global' | '';
        cache_file?: string;
        cache_duration?: number;
        check_if_update_available?: boolean;
        remind_duration?: number;
        force?: boolean;
        client_event_id?: string;
        previous_client_event_id?: string;
        unref?: boolean;
        child_path?: string;
        now?: () => number;
    };
    type State = Required<Input>;
    type Response = {
        client_event_id: string;
        previous_client_event_id: string;
        product: string;
        cli_path_hash: string;
        local_timestamp: string;
        previous_version: string;
        current_version: string;
        current_release_date: number;
        current_download_url: string;
        current_changelog_url: string;
        package: string;
        release_tag: string;
        install_command: string;
        project_website: string;
        outdated: boolean;
        alerts: {
            id: number;
            date: number;
            message: string;
            url: string;
            level: string;
        }[];
    };
    type Result = {
        status: 'ok';
        data: Response;
    } | {
        status: 'waiting';
        data: ChildProcess;
    } | {
        status: 'reminded';
        data: Response;
    } | {
        status: 'disabled';
    };
    type Cache = {
        last_reminder: number;
        cached_at: number;
        version: string;
        cli_path: string;
        output: Response;
    };
}
export default function check(input: Check.Input): Promise<Check.Result>;
/**
 *
 * @param product The name of the product, e.g. 'prisma'
 * @param cacheIdentifier Identifier to differentiate different cache files for a product
 */
export declare function getCacheFile(product: string, cacheIdentifier: string): string;
