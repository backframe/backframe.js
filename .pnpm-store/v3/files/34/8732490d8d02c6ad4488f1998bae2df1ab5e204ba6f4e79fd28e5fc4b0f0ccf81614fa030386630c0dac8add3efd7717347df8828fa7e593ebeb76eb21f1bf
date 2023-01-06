"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupCache = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
const rimraf_1 = __importDefault(require("rimraf"));
const util_2 = require("util");
const p_map_1 = __importDefault(require("p-map"));
const debug_1 = __importDefault(require("@prisma/debug"));
const debug = debug_1.default('cleanupCache');
const del = util_2.promisify(rimraf_1.default);
const readdir = util_2.promisify(fs_1.default.readdir);
const stat = util_2.promisify(fs_1.default.stat);
async function cleanupCache(n = 5) {
    try {
        const rootCacheDir = await util_1.getRootCacheDir();
        if (!rootCacheDir) {
            debug('no rootCacheDir found');
            return;
        }
        const channel = 'master';
        const cacheDir = path_1.default.join(rootCacheDir, channel);
        const dirs = await readdir(cacheDir);
        const dirsWithMeta = await Promise.all(dirs.map(async (dirName) => {
            const dir = path_1.default.join(cacheDir, dirName);
            const statResult = await stat(dir);
            return {
                dir,
                created: statResult.birthtime,
            };
        }));
        dirsWithMeta.sort((a, b) => (a.created < b.created ? 1 : -1));
        const dirsToRemove = dirsWithMeta.slice(n);
        await p_map_1.default(dirsToRemove, (dir) => del(dir.dir), { concurrency: 20 });
    }
    catch (e) {
        // fail silently
    }
}
exports.cleanupCache = cleanupCache;
//# sourceMappingURL=cleanupCache.js.map