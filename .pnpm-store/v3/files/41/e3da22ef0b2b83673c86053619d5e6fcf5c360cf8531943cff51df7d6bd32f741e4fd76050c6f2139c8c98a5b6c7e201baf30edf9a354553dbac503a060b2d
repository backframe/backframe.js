import type { ConnectorType } from '@prisma/generator-helper';
import type { DatabaseCredentials } from './types';
export declare function credentialsToUri(credentials: DatabaseCredentials): string;
export declare function uriToCredentials(connectionString: string): DatabaseCredentials;
/**
 * Convert a protocol to the equivalent database connector type.
 * Throws an error if the protocol is not recognized.
 * @param protocol e.g., 'postgres:'
 */
export declare function protocolToConnectorType(protocol: string): ConnectorType;
