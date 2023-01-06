/// <reference types="node" />
import { Platform } from './platforms';
export declare type Arch = 'x32' | 'x64' | 'arm' | 'arm64' | 's390' | 's390x' | 'mipsel' | 'ia32' | 'mips' | 'ppc' | 'ppc64';
export declare type GetOSResult = {
    platform: NodeJS.Platform;
    libssl?: string;
    arch: Arch;
    distro?: 'rhel' | 'debian' | 'musl' | 'arm' | 'nixos' | 'freebsd11' | 'freebsd12';
};
export declare function getos(): Promise<GetOSResult>;
export declare function parseDistro(input: string): GetOSResult['distro'];
export declare function resolveDistro(): Promise<undefined | GetOSResult['distro']>;
export declare function parseOpenSSLVersion(input: string): string | undefined;
export declare function getOpenSSLVersion(): Promise<string | undefined>;
export declare function getPlatform(): Promise<Platform>;
