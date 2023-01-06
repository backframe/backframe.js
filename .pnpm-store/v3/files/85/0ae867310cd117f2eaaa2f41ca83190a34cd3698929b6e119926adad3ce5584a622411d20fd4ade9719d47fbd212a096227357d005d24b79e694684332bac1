"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plusX = exports.maybeCopyToTmp = exports.getBinaryEnvVarPath = exports.getBinaryName = exports.checkVersionCommand = exports.getVersion = exports.download = exports.BinaryType = void 0;
const debug_1 = __importDefault(require("@prisma/debug"));
const get_platform_1 = require("@prisma/get-platform");
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const make_dir_1 = __importDefault(require("make-dir"));
const p_filter_1 = __importDefault(require("p-filter"));
const path_1 = __importDefault(require("path"));
const temp_dir_1 = __importDefault(require("temp-dir"));
const util_1 = require("util");
const chmod_1 = __importDefault(require("./chmod"));
const cleanupCache_1 = require("./cleanupCache");
const downloadZip_1 = require("./downloadZip");
const flatMap_1 = require("./flatMap");
const getHash_1 = require("./getHash");
const getLatestTag_1 = require("./getLatestTag");
const log_1 = require("./log");
const util_2 = require("./util");
const debug = (0, debug_1.default)('prisma:download');
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const exists = (0, util_1.promisify)(fs_1.default.exists);
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const copyFile = (0, util_1.promisify)(fs_1.default.copyFile);
const utimes = (0, util_1.promisify)(fs_1.default.utimes);
const channel = 'master';
var BinaryType;
(function (BinaryType) {
    BinaryType["queryEngine"] = "query-engine";
    BinaryType["libqueryEngine"] = "libquery-engine";
    BinaryType["migrationEngine"] = "migration-engine";
    BinaryType["introspectionEngine"] = "introspection-engine";
    BinaryType["prismaFmt"] = "prisma-fmt";
})(BinaryType = exports.BinaryType || (exports.BinaryType = {}));
const BINARY_TO_ENV_VAR = {
    [BinaryType.migrationEngine]: 'PRISMA_MIGRATION_ENGINE_BINARY',
    [BinaryType.queryEngine]: 'PRISMA_QUERY_ENGINE_BINARY',
    [BinaryType.libqueryEngine]: 'PRISMA_QUERY_ENGINE_LIBRARY',
    [BinaryType.introspectionEngine]: 'PRISMA_INTROSPECTION_ENGINE_BINARY',
    [BinaryType.prismaFmt]: 'PRISMA_FMT_BINARY',
};
async function download(options) {
    var _a, _b;
    // get platform
    const platform = await (0, get_platform_1.getPlatform)();
    const os = await (0, get_platform_1.getos)();
    if (os.distro && ['nixos'].includes(os.distro)) {
        console.error(`${chalk_1.default.yellow('Warning')} Precompiled engine files are not available for ${os.distro}.`);
    }
    else if (['freebsd11', 'freebsd12', 'freebsd13', 'openbsd', 'netbsd'].includes(platform)) {
        console.error(`${chalk_1.default.yellow('Warning')} Precompiled engine files are not available for ${platform}. Read more about building your own engines at https://pris.ly/d/build-engines`);
    }
    else if (BinaryType.libqueryEngine in options.binaries) {
        await (0, get_platform_1.isNodeAPISupported)();
    }
    // no need to do anything, if there are no binaries
    if (!options.binaries || Object.values(options.binaries).length === 0) {
        return {}; // we don't download anything if nothing is provided
    }
    // merge options
    const opts = {
        ...options,
        binaryTargets: (_a = options.binaryTargets) !== null && _a !== void 0 ? _a : [platform],
        version: (_b = options.version) !== null && _b !== void 0 ? _b : 'latest',
        binaries: mapKeys(options.binaries, (key) => engineTypeToBinaryType(key, platform)), // just necessary to support both camelCase and hyphen-case
    };
    // creates a matrix of binaries x binary targets
    const binaryJobs = (0, flatMap_1.flatMap)(Object.entries(opts.binaries), ([binaryName, targetFolder]) => opts.binaryTargets.map((binaryTarget) => {
        const fileName = binaryName === BinaryType.libqueryEngine
            ? (0, get_platform_1.getNodeAPIName)(binaryTarget, 'fs')
            : getBinaryName(binaryName, binaryTarget);
        const targetFilePath = path_1.default.join(targetFolder, fileName);
        return {
            binaryName,
            targetFolder,
            binaryTarget,
            fileName,
            targetFilePath,
            envVarPath: getBinaryEnvVarPath(binaryName),
        };
    }));
    if (process.env.BINARY_DOWNLOAD_VERSION) {
        opts.version = process.env.BINARY_DOWNLOAD_VERSION;
    }
    // TODO: look to remove latest, because we always pass a version
    if (opts.version === 'latest') {
        opts.version = await (0, getLatestTag_1.getLatestTag)();
    }
    if (opts.printVersion) {
        console.log(`version: ${opts.version}`);
    }
    // filter out files, which don't yet exist or have to be created
    const binariesToDownload = await (0, p_filter_1.default)(binaryJobs, async (job) => {
        const needsToBeDownloaded = await binaryNeedsToBeDownloaded(job, platform, opts.version, opts.failSilent);
        const isSupported = get_platform_1.platforms.includes(job.binaryTarget);
        const shouldDownload = isSupported &&
            !job.envVarPath && // this is for custom binaries
            (opts.ignoreCache || needsToBeDownloaded); // TODO: do we need ignoreCache?
        if (needsToBeDownloaded && !isSupported) {
            throw new Error(`Unknown binaryTarget ${job.binaryTarget} and no custom engine files were provided`);
        }
        return shouldDownload;
    });
    if (binariesToDownload.length > 0) {
        const cleanupPromise = (0, cleanupCache_1.cleanupCache)(); // already start cleaning up while we download
        let finishBar;
        let setProgress;
        if (opts.showProgress) {
            const collectiveBar = getCollectiveBar(opts);
            finishBar = collectiveBar.finishBar;
            setProgress = collectiveBar.setProgress;
        }
        await Promise.all(binariesToDownload.map((job) => downloadBinary({
            ...job,
            version: opts.version,
            failSilent: opts.failSilent,
            progressCb: setProgress ? setProgress(job.targetFilePath) : undefined,
        })));
        await cleanupPromise; // make sure, that cleanup finished
        if (finishBar) {
            finishBar();
        }
    }
    const binaryPaths = binaryJobsToBinaryPaths(binaryJobs);
    const dir = eval('__dirname');
    // this is necessary for pkg
    if (dir.startsWith('/snapshot/')) {
        for (const engineType in binaryPaths) {
            const binaryTargets = binaryPaths[engineType];
            for (const binaryTarget in binaryTargets) {
                const binaryPath = binaryTargets[binaryTarget];
                binaryTargets[binaryTarget] = await maybeCopyToTmp(binaryPath);
            }
        }
    }
    return binaryPaths;
}
exports.download = download;
function getCollectiveBar(options) {
    var _a, _b;
    const hasNodeAPI = 'libquery-engine' in options.binaries;
    const bar = (0, log_1.getBar)(`Downloading Prisma engines${hasNodeAPI ? ' for Node-API' : ''} for ${(_a = options.binaryTargets) === null || _a === void 0 ? void 0 : _a.map((p) => chalk_1.default.bold(p)).join(' and ')}`);
    const progressMap = {};
    // Object.values is faster than Object.keys
    const numDownloads = Object.values(options.binaries).length *
        Object.values((_b = options === null || options === void 0 ? void 0 : options.binaryTargets) !== null && _b !== void 0 ? _b : []).length;
    const setProgress = (sourcePath) => (progress) => {
        progressMap[sourcePath] = progress;
        const progressValues = Object.values(progressMap);
        const totalProgress = progressValues.reduce((acc, curr) => {
            return acc + curr;
        }, 0) / numDownloads;
        if (options.progressCb) {
            options.progressCb(totalProgress);
        }
        if (bar) {
            bar.update(totalProgress);
        }
    };
    return {
        setProgress,
        finishBar: () => {
            bar.update(1);
            bar.terminate();
        },
    };
}
function binaryJobsToBinaryPaths(jobs) {
    return jobs.reduce((acc, job) => {
        if (!acc[job.binaryName]) {
            acc[job.binaryName] = {};
        }
        // if an env var path has been provided, prefer that one
        acc[job.binaryName][job.binaryTarget] = job.envVarPath || job.targetFilePath;
        return acc;
    }, {});
}
async function binaryNeedsToBeDownloaded(job, nativePlatform, version, failSilent) {
    // If there is an ENV Override and the file exists then it does not need to be downloaded
    if (job.envVarPath && fs_1.default.existsSync(job.envVarPath)) {
        return false;
    }
    // 1. Check if file exists
    const targetExists = await exists(job.targetFilePath);
    // 2. If exists, check, if cached file exists and is up to date and has same hash as file.
    // If not, copy cached file over
    const cachedFile = await getCachedBinaryPath({
        ...job,
        version,
        failSilent,
    });
    if (cachedFile) {
        const sha256FilePath = cachedFile + '.sha256';
        if (await exists(sha256FilePath)) {
            const sha256File = await readFile(sha256FilePath, 'utf-8');
            const sha256Cache = await (0, getHash_1.getHash)(cachedFile);
            if (sha256File === sha256Cache) {
                if (!targetExists) {
                    debug(`copying ${cachedFile} to ${job.targetFilePath}`);
                    // TODO Remove when https://github.com/docker/for-linux/issues/1015 is fixed
                    // Workaround for https://github.com/prisma/prisma/issues/7037
                    await utimes(cachedFile, new Date(), new Date());
                    await copyFile(cachedFile, job.targetFilePath);
                }
                const targetSha256 = await (0, getHash_1.getHash)(job.targetFilePath);
                if (sha256File !== targetSha256) {
                    debug(`overwriting ${job.targetFilePath} with ${cachedFile} as hashes do not match`);
                    await copyFile(cachedFile, job.targetFilePath);
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    // If there is no cache and the file doesn't exist, we for sure need to download it
    if (!targetExists) {
        debug(`file ${job.targetFilePath} does not exist and must be downloaded`);
        return true;
    }
    // 3. If same platform, always check --version
    if (job.binaryTarget === nativePlatform &&
        job.binaryName !== BinaryType.libqueryEngine) {
        const works = await checkVersionCommand(job.targetFilePath);
        return !works;
    } // TODO: this is probably not useful anymore
    return false;
}
async function getVersion(enginePath) {
    const result = await (0, execa_1.default)(enginePath, ['--version']);
    return result.stdout;
}
exports.getVersion = getVersion;
async function checkVersionCommand(enginePath) {
    try {
        const version = await getVersion(enginePath);
        return version.length > 0;
    }
    catch (e) {
        return false;
    }
}
exports.checkVersionCommand = checkVersionCommand;
function getBinaryName(binaryName, platform) {
    if (binaryName === BinaryType.libqueryEngine) {
        return `${(0, get_platform_1.getNodeAPIName)(platform, 'url')}`;
    }
    const extension = platform === 'windows' ? '.exe' : '';
    return `${binaryName}-${platform}${extension}`;
}
exports.getBinaryName = getBinaryName;
async function getCachedBinaryPath({ version, binaryTarget, binaryName, }) {
    const cacheDir = await (0, util_2.getCacheDir)(channel, version, binaryTarget);
    if (!cacheDir) {
        return null;
    }
    const cachedTargetPath = path_1.default.join(cacheDir, binaryName);
    if (!fs_1.default.existsSync(cachedTargetPath)) {
        return null;
    }
    // All versions not called 'latest' are unique
    // only latest needs more checks
    if (version !== 'latest') {
        return cachedTargetPath;
    }
    if (await exists(cachedTargetPath)) {
        return cachedTargetPath;
    }
    return null;
}
function getBinaryEnvVarPath(binaryName) {
    const envVar = BINARY_TO_ENV_VAR[binaryName];
    if (envVar && process.env[envVar]) {
        const envVarPath = path_1.default.resolve(process.cwd(), process.env[envVar]);
        if (!fs_1.default.existsSync(envVarPath)) {
            throw new Error(`Env var ${chalk_1.default.bold(envVar)} is provided but provided path ${chalk_1.default.underline(process.env[envVar])} can't be resolved.`);
        }
        debug(`Using env var ${chalk_1.default.bold(envVar)} for binary ${chalk_1.default.bold(binaryName)}, which points to ${chalk_1.default.underline(process.env[envVar])}`);
        return envVarPath;
    }
    return null;
}
exports.getBinaryEnvVarPath = getBinaryEnvVarPath;
async function downloadBinary(options) {
    const { version, progressCb, targetFilePath, binaryTarget, binaryName } = options;
    const downloadUrl = (0, util_2.getDownloadUrl)('all_commits', version, binaryTarget, binaryName);
    const targetDir = path_1.default.dirname(targetFilePath);
    try {
        fs_1.default.accessSync(targetDir, fs_1.default.constants.W_OK);
        await (0, make_dir_1.default)(targetDir);
    }
    catch (e) {
        if (options.failSilent || e.code !== 'EACCES') {
            return;
        }
        else {
            throw new Error(`Can't write to ${targetDir} please make sure you install "prisma" with the right permissions.`);
        }
    }
    debug(`Downloading ${downloadUrl} to ${targetFilePath}`);
    if (progressCb) {
        progressCb(0);
    }
    const { sha256, zippedSha256 } = await (0, downloadZip_1.downloadZip)(downloadUrl, targetFilePath, progressCb);
    if (progressCb) {
        progressCb(1);
    }
    if (process.platform !== 'win32') {
        (0, chmod_1.default)(targetFilePath);
    }
    // Cache result
    await saveFileToCache(options, version, sha256, zippedSha256);
}
async function saveFileToCache(job, version, sha256, zippedSha256) {
    // always fail silent, as the cache is optional
    const cacheDir = await (0, util_2.getCacheDir)(channel, version, job.binaryTarget);
    if (!cacheDir) {
        return;
    }
    const cachedTargetPath = path_1.default.join(cacheDir, job.binaryName);
    const cachedSha256Path = path_1.default.join(cacheDir, job.binaryName + '.sha256');
    const cachedSha256ZippedPath = path_1.default.join(cacheDir, job.binaryName + '.gz.sha256');
    try {
        await copyFile(job.targetFilePath, cachedTargetPath);
        await writeFile(cachedSha256Path, sha256);
        await writeFile(cachedSha256ZippedPath, zippedSha256);
    }
    catch (e) {
        debug(e);
        // let this fail silently - the CI system may have reached the file size limit
    }
}
function engineTypeToBinaryType(engineType, binaryTarget) {
    if (BinaryType[engineType]) {
        return BinaryType[engineType];
    }
    if (engineType === 'native') {
        return binaryTarget;
    }
    return engineType;
}
function mapKeys(obj, mapper) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[mapper(key)] = value;
        return acc;
    }, {});
}
async function maybeCopyToTmp(file) {
    // in this case, we are in a "pkg" context with a virtual fs
    // to make this work, we need to copy the binary to /tmp and execute it from there
    const dir = eval('__dirname');
    if (dir.startsWith('/snapshot/')) {
        const targetDir = path_1.default.join(temp_dir_1.default, 'prisma-binaries');
        await (0, make_dir_1.default)(targetDir);
        const target = path_1.default.join(targetDir, path_1.default.basename(file));
        const data = await readFile(file);
        await writeFile(target, data);
        // We have to read and write until https://github.com/zeit/pkg/issues/639
        // is resolved
        // await copyFile(file, target)
        plusX(target);
        return target;
    }
    return file;
}
exports.maybeCopyToTmp = maybeCopyToTmp;
function plusX(file) {
    const s = fs_1.default.statSync(file);
    const newMode = s.mode | 64 | 8 | 1;
    if (s.mode === newMode) {
        return;
    }
    const base8 = newMode.toString(8).slice(-3);
    fs_1.default.chmodSync(file, base8);
}
exports.plusX = plusX;
//# sourceMappingURL=download.js.map