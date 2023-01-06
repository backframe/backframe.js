"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatform = exports.getOpenSSLVersion = exports.parseOpenSSLVersion = exports.resolveDistro = exports.parseDistro = exports.getos = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const exists = (0, util_1.promisify)(fs_1.default.exists);
async function getos() {
    const platform = os_1.default.platform();
    const arch = process.arch;
    if (platform === 'freebsd') {
        const version = await gracefulExec(`freebsd-version`);
        if (version && version.trim().length > 0) {
            const regex = /^(\d+)\.?/;
            const match = regex.exec(version);
            if (match) {
                return {
                    platform: 'freebsd',
                    distro: `freebsd${match[1]}`,
                    arch,
                };
            }
        }
    }
    if (platform !== 'linux') {
        return {
            platform,
            arch,
        };
    }
    return {
        platform: 'linux',
        libssl: await getOpenSSLVersion(),
        distro: await resolveDistro(),
        arch,
    };
}
exports.getos = getos;
function parseDistro(input) {
    const idRegex = /^ID="?([^"\n]*)"?$/im;
    const idLikeRegex = /^ID_LIKE="?([^"\n]*)"?$/im;
    const idMatch = idRegex.exec(input);
    const id = (idMatch && idMatch[1] && idMatch[1].toLowerCase()) || '';
    const idLikeMatch = idLikeRegex.exec(input);
    const idLike = (idLikeMatch && idLikeMatch[1] && idLikeMatch[1].toLowerCase()) || '';
    if (id === 'raspbian') {
        return 'arm';
    }
    if (id === 'nixos') {
        return 'nixos';
    }
    if (idLike.includes('centos') ||
        idLike.includes('fedora') ||
        idLike.includes('rhel') ||
        id === 'fedora') {
        return 'rhel';
    }
    if (idLike.includes('debian') ||
        idLike.includes('ubuntu') ||
        id === 'debian') {
        return 'debian';
    }
    return;
}
exports.parseDistro = parseDistro;
async function resolveDistro() {
    // https://github.com/retrohacker/getos/blob/master/os.json
    const osReleaseFile = '/etc/os-release';
    const alpineReleaseFile = '/etc/alpine-release';
    if (await exists(alpineReleaseFile)) {
        return 'musl';
    }
    else if (await exists(osReleaseFile)) {
        return parseDistro(await readFile(osReleaseFile, 'utf-8'));
    }
    else {
        return;
    }
}
exports.resolveDistro = resolveDistro;
function parseOpenSSLVersion(input) {
    const match = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(input);
    if (match) {
        return match[1] + '.x';
    }
    return;
}
exports.parseOpenSSLVersion = parseOpenSSLVersion;
// getOpenSSLVersion returns the OpenSSL version excluding the patch version, e.g. "1.1.x"
async function getOpenSSLVersion() {
    const [version, ls] = await Promise.all([
        gracefulExec(`openssl version -v`),
        gracefulExec(`
      ls -l /lib64 | grep ssl;
      ls -l /usr/lib64 | grep ssl;
    `),
    ]);
    if (version) {
        const v = parseOpenSSLVersion(version);
        if (v) {
            return v;
        }
    }
    if (ls) {
        const match = /libssl\.so\.(\d+\.\d+)\.\d+/.exec(ls);
        if (match) {
            return match[1] + '.x';
        }
    }
    return undefined;
}
exports.getOpenSSLVersion = getOpenSSLVersion;
async function gracefulExec(cmd) {
    return new Promise((resolve) => {
        try {
            (0, child_process_1.exec)(cmd, (err, stdout) => {
                resolve(String(stdout));
            });
        }
        catch (e) {
            resolve(undefined);
            return undefined;
        }
    });
}
async function getPlatform() {
    const { platform, libssl, distro, arch } = await getos();
    // Apple Silicon (M1)
    if (platform === 'darwin' && arch === 'arm64') {
        return 'darwin-arm64';
    }
    if (platform === 'darwin') {
        return 'darwin';
    }
    if (platform === 'win32') {
        return 'windows';
    }
    if (platform === 'freebsd') {
        return distro;
    }
    if (platform === 'openbsd') {
        return 'openbsd';
    }
    if (platform === 'netbsd') {
        return 'netbsd';
    }
    if (platform === 'linux' && arch === 'arm64') {
        // 64 bit ARM
        return `linux-arm64-openssl-${libssl}`;
    }
    if (platform === 'linux' && arch === 'arm') {
        // 32 bit ARM
        return `linux-arm-openssl-${libssl}`;
    }
    if (platform === 'linux' && distro === 'nixos') {
        return 'linux-nixos';
    }
    if (platform === 'linux' && distro === 'musl') {
        return 'linux-musl';
    }
    // when the platform is linux
    if (platform === 'linux' && distro && libssl) {
        return (distro + '-openssl-' + libssl);
    }
    // if just OpenSSL is known, fallback to debian with a specific libssl version
    if (libssl) {
        return ('debian-openssl-' + libssl);
    }
    // if just the distro is known, fallback to latest OpenSSL 1.1
    if (distro) {
        return (distro + '-openssl-1.1.x');
    }
    // use the debian build with OpenSSL 1.1 as a last resort
    return 'debian-openssl-1.1.x';
}
exports.getPlatform = getPlatform;
//# sourceMappingURL=getPlatform.js.map