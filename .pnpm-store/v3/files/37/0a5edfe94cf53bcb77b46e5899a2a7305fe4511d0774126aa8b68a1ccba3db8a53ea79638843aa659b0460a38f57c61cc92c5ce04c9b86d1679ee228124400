"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlExists = exports.getAllUrls = exports.getLatestTag = void 0;
const get_platform_1 = require("@prisma/get-platform");
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const p_map_1 = __importDefault(require("p-map"));
const getProxyAgent_1 = require("./getProxyAgent");
const util_1 = require("./util");
async function getLatestTag() {
    let branch = await getBranch();
    if (branch !== 'master' &&
        !isPatchBranch(branch) &&
        !branch.startsWith('integration/')) {
        branch = 'master';
    }
    // remove the "integration/" part
    branch = branch.replace(/^integration\//, '');
    // console.log({ branch }, 'after replace')
    // first try to get the branch as it is
    // if it doesn't have an equivalent in the engines repo
    // default back to master
    let commits = await getCommits(branch);
    if ((!commits || !Array.isArray(commits)) &&
        branch !== 'master' &&
        !isPatchBranch(branch)) {
        console.log(`Overwriting branch "${branch}" with "master" as it's not a branch we have binaries for`);
        branch = 'master';
        commits = await getCommits(branch);
    }
    if (!Array.isArray(commits)) {
        console.error(commits);
        throw new Error(`Could not fetch commits from github: ${JSON.stringify(commits, null, 2)}`);
    }
    return getFirstFinishedCommit(branch, commits);
}
exports.getLatestTag = getLatestTag;
function getAllUrls(branch, commit) {
    const urls = [];
    const excludedPlatforms = [
        'freebsd',
        'arm',
        'linux-nixos',
        'openbsd',
        'netbsd',
        'freebsd11',
        'freebsd12',
    ];
    const relevantPlatforms = get_platform_1.platforms.filter((p) => !excludedPlatforms.includes(p));
    for (const platform of relevantPlatforms) {
        for (const engine of [
            'query-engine',
            'introspection-engine',
            'migration-engine',
            'prisma-fmt',
        ]) {
            for (const extension of [
                '.gz',
                '.gz.sha256',
                '.gz.sig',
                '.sig',
                '.sha256',
            ]) {
                const downloadUrl = util_1.getDownloadUrl(branch, commit, platform, engine, extension);
                urls.push(downloadUrl);
            }
        }
    }
    return urls;
}
exports.getAllUrls = getAllUrls;
async function getFirstFinishedCommit(branch, commits) {
    for (const commit of commits) {
        const urls = getAllUrls(branch, commit);
        // TODO: potential to speed things up
        // We don't always need to wait for the last commit
        const exist = await p_map_1.default(urls, urlExists, { concurrency: 10 });
        const hasMissing = exist.some((e) => !e);
        if (!hasMissing) {
            return commit;
        }
        else {
            const missing = urls.filter((_, i) => !exist[i]);
            // if all are missing, we don't have to talk about it
            // it might just be a broken commit or just still building
            if (missing.length !== urls.length) {
                console.log(`${chalk_1.default.blueBright('info')} The engine commit ${commit} is not yet done. We're skipping it as we're in dev. Missing urls: ${missing.length}`);
            }
        }
    }
}
async function urlExists(url) {
    try {
        const res = await node_fetch_1.default(url, {
            method: 'HEAD',
            agent: getProxyAgent_1.getProxyAgent(url),
        });
        const headers = fromEntries(res.headers.entries());
        if (res.status > 200) {
            // console.error(res, headers)
        }
        if (parseInt(headers['content-length']) > 0) {
            return res.status < 300;
        }
    }
    catch (e) {
        //
        // console.error(e)
    }
    return false;
}
exports.urlExists = urlExists;
function fromEntries(entries) {
    const result = {};
    for (const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}
async function getBranch() {
    if (process.env.NODE_ENV !== 'test') {
        if (process.env.PATCH_BRANCH) {
            return process.env.PATCH_BRANCH;
        }
        if (process.env.BUILDKITE_BRANCH) {
            return process.env.BUILDKITE_BRANCH;
        }
        if (process.env.GITHUB_CONTEXT) {
            const context = JSON.parse(process.env.GITHUB_CONTEXT);
            return context.head_ref;
        }
    }
    // Need to be handled
    // for example it's used in https://github.com/prisma/binary-tester and the environment
    // is not a git repository so it fails
    try {
        const result = await execa_1.default.command('git rev-parse --abbrev-ref HEAD', {
            shell: true,
            stdio: 'pipe',
        });
        return result.stdout;
    }
    catch (e) {
        console.error(e);
    }
    return;
}
// TODO: Adjust this for stable release
function isPatchBranch(version) {
    return /^2\.(\d+)\.x/.test(version);
}
async function getCommits(branch) {
    const url = `https://github-cache.prisma.workers.dev/repos/prisma/prisma-engines/commits?sha=${branch}`;
    const result = await node_fetch_1.default(url, {
        agent: getProxyAgent_1.getProxyAgent(url),
        headers: {
            Authorization: process.env.GITHUB_TOKEN
                ? `token ${process.env.GITHUB_TOKEN}`
                : undefined,
        },
    }).then((res) => res.json());
    if (!Array.isArray(result)) {
        return result;
    }
    const commits = result.map((r) => r.sha);
    return commits;
}
//# sourceMappingURL=getLatestTag.js.map