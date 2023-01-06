"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrl = exports.getCacheDir = exports.getRootCacheDir = void 0;
const debug_1 = __importDefault(require("@prisma/debug"));
const get_platform_1 = require("@prisma/get-platform");
const find_cache_dir_1 = __importDefault(require("find-cache-dir"));
const fs_1 = __importDefault(require("fs"));
const make_dir_1 = __importDefault(require("make-dir"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const download_1 = require("./download");
const debug = (0, debug_1.default)('prisma:cache-dir');
async function getRootCacheDir() {
    if (os_1.default.platform() === 'win32') {
        const cacheDir = (0, find_cache_dir_1.default)({ name: 'prisma', create: true });
        if (cacheDir) {
            return cacheDir;
        }
        if (process.env.APPDATA) {
            return path_1.default.join(process.env.APPDATA, 'Prisma');
        }
    }
    // if this is lambda, nope
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        try {
            await (0, make_dir_1.default)(`/tmp/prisma-download`);
            return `/tmp/prisma-download`;
        }
        catch (e) {
            return null;
        }
    }
    return path_1.default.join(os_1.default.homedir(), '.cache/prisma');
}
exports.getRootCacheDir = getRootCacheDir;
async function getCacheDir(channel, version, platform) {
    const rootCacheDir = await getRootCacheDir();
    if (!rootCacheDir) {
        return null;
    }
    const cacheDir = path_1.default.join(rootCacheDir, channel, version, platform);
    try {
        if (!fs_1.default.existsSync(cacheDir)) {
            await (0, make_dir_1.default)(cacheDir);
        }
    }
    catch (e) {
        debug('The following error is being caught and just there for debugging:');
        debug(e);
        return null;
    }
    return cacheDir;
}
exports.getCacheDir = getCacheDir;
function getDownloadUrl(channel, version, platform, binaryName, extension = '.gz') {
    const baseUrl = process.env.PRISMA_BINARIES_MIRROR || // TODO: remove this
        process.env.PRISMA_ENGINES_MIRROR ||
        'https://binaries.prisma.sh';
    const finalExtension = platform === 'windows' && download_1.BinaryType.libqueryEngine !== binaryName
        ? `.exe${extension}`
        : extension;
    if (binaryName === download_1.BinaryType.libqueryEngine) {
        binaryName = (0, get_platform_1.getNodeAPIName)(platform, 'url');
    }
    return `${baseUrl}/${channel}/${version}/${platform}/${binaryName}${finalExtension}`;
}
exports.getDownloadUrl = getDownloadUrl;
//# sourceMappingURL=util.js.map