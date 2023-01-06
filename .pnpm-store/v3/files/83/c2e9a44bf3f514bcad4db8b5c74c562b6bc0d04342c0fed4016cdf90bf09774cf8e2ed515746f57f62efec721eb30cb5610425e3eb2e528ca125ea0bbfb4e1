"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadZip = void 0;
const zlib_1 = __importDefault(require("zlib"));
const p_retry_1 = __importDefault(require("p-retry"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const getProxyAgent_1 = require("./getProxyAgent");
const tempy_1 = __importDefault(require("tempy"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("@prisma/debug"));
const hasha_1 = __importDefault(require("hasha"));
const util_1 = require("util");
const rimraf_1 = __importDefault(require("rimraf"));
const debug = debug_1.default('prisma:downloadZip');
const del = util_1.promisify(rimraf_1.default);
async function fetchSha256(url) {
    // We get a string like this:
    // "3c82ee6cd9fedaec18a5e7cd3fc41f8c6b3dd32575dc13443d96aab4bd018411  query-engine.gz\n"
    // So we split it by whitespace and just get the hash, as that's what we're interested in
    const [zippedSha256, sha256] = [
        (await node_fetch_1.default(`${url}.sha256`, {
            agent: getProxyAgent_1.getProxyAgent(url),
        }).then((res) => res.text())).split(/\s+/)[0],
        (await node_fetch_1.default(`${url.slice(0, url.length - 3)}.sha256`, {
            agent: getProxyAgent_1.getProxyAgent(url.slice(0, url.length - 3)),
        }).then((res) => res.text())).split(/\s+/)[0],
    ];
    return { sha256, zippedSha256 };
}
async function downloadZip(url, target, progressCb) {
    const tmpDir = tempy_1.default.directory();
    const partial = path_1.default.join(tmpDir, 'partial');
    const { sha256, zippedSha256 } = await fetchSha256(url);
    const result = await p_retry_1.default(async () => {
        try {
            const resp = await node_fetch_1.default(url, {
                compress: false,
                agent: getProxyAgent_1.getProxyAgent(url),
            });
            if (resp.status !== 200) {
                throw new Error(resp.statusText + ' ' + url);
            }
            const lastModified = resp.headers.get('last-modified');
            const size = parseFloat(resp.headers.get('content-length'));
            const ws = fs_1.default.createWriteStream(partial);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
            return await new Promise(async (resolve, reject) => {
                let bytesRead = 0;
                resp.body.on('error', reject).on('data', (chunk) => {
                    bytesRead += chunk.length;
                    if (size && progressCb) {
                        progressCb(bytesRead / size);
                    }
                });
                const gunzip = zlib_1.default.createGunzip();
                gunzip.on('error', reject);
                const zipStream = resp.body.pipe(gunzip);
                const zippedHashPromise = hasha_1.default.fromStream(resp.body, {
                    algorithm: 'sha256',
                });
                const hashPromise = hasha_1.default.fromStream(zipStream, {
                    algorithm: 'sha256',
                });
                zipStream.pipe(ws);
                ws.on('error', reject).on('close', () => {
                    resolve({ lastModified, sha256, zippedSha256 });
                });
                const hash = await hashPromise;
                const zippedHash = await zippedHashPromise;
                if (zippedHash !== zippedSha256) {
                    throw new Error(`sha256 of ${url} (zipped) should be ${zippedSha256} but is ${zippedHash}`);
                }
                if (hash !== sha256) {
                    throw new Error(`sha256 of ${url} (uzipped) should be ${sha256} but is ${hash}`);
                }
            });
        }
        finally {
            //
        }
    }, {
        retries: 2,
        onFailedAttempt: (err) => debug(err),
    });
    fs_1.default.copyFileSync(partial, target);
    // it's ok if the unlink fails
    try {
        await del(partial);
        await del(tmpDir);
    }
    catch (e) {
        debug(e);
    }
    return result;
}
exports.downloadZip = downloadZip;
//# sourceMappingURL=downloadZip.js.map