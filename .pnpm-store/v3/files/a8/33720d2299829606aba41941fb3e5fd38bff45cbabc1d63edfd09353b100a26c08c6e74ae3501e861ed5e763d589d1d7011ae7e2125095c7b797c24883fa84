'use strict';

var writeFileFn = require('fast-write-atomic');
var tempfile = require('tempfile');
var util = require('util');
var uuid = require('uuid');
var paths = require('env-paths');
var makeDir = require('make-dir');
var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var writeFileFn__default = /*#__PURE__*/_interopDefaultLegacy(writeFileFn);
var tempfile__default = /*#__PURE__*/_interopDefaultLegacy(tempfile);
var paths__default = /*#__PURE__*/_interopDefaultLegacy(paths);
var makeDir__default = /*#__PURE__*/_interopDefaultLegacy(makeDir);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

// Signature is a random signature that is stored and used

const exists = util.promisify(fs__default['default'].exists);
const readFile = util.promisify(fs__default['default'].readFile);
const writeFile = util.promisify(writeFileFn__default['default']);





// File identifier for the new global signature file
const PRISMA_SIGNATURE = 'signature';
const PRISMA_CACHE_FILE = 'prisma';

// IMPORTANT: this is part of the public API
async function getSignature(signatureFile, cacheFile) {
  const dirs = paths__default['default'](`checkpoint`);
  cacheFile = cacheFile || path__default['default'].join(dirs.cache, PRISMA_CACHE_FILE); // Old schema file
  signatureFile = signatureFile || path__default['default'].join(dirs.cache, PRISMA_SIGNATURE); // new file for signature

  if (await exists(signatureFile)) {
    // The signatureFile replaces cacheFile as the source of turth and therefore takes precedence
    const signature = await readSignature(signatureFile);
    if (signature) {
      return signature
    }
  }

  if (await exists(cacheFile)) {
    const signature = await readSignature(cacheFile);
    if (signature) {
      // Found config file with valid signature – migrate signature to new file
      await createSignatureFile(signatureFile, signature);
      return signature
    }
  }

  return await createSignatureFile(signatureFile)
}

function isSignatureValid(signature) {
  return typeof signature === 'string' && signature.length === 36
}

/**
 * Parse a file containing json and return the `signature` key from it
 * @returns string empty if invalid or not found
 */
async function readSignature(file) {
  try {
    const data = await readFile(file, 'utf8');
    const { signature } = JSON.parse(data);
    if (isSignatureValid(signature)) {
      return signature
    }
    return ''
  } catch (err) {
    return ''
  }
}

async function createSignatureFile(signatureFile, signature) {
  // Use passed signature or generate new
  const signatureState = {
    signature: signature || uuid.v4(),
  };
  await makeDir__default['default'](path__default['default'].dirname(signatureFile));
  await writeFile(signatureFile, JSON.stringify(signatureState, null, '  '));
  return signatureState.signature
}

// Imports

const writeFile$1 = util.promisify(writeFileFn__default['default']);

// Check tests
describe('signature', () => {
  const testSignatureFile = tempfile__default['default']();
  const testCacheFile = tempfile__default['default']();
  const testCacheSignature = 'd4fa2acd-34ec-43eb-bb67-30e572e29932';
  // testOldCacheFile is the previous schema for check cache which had the signature before it was global
  const testOldCacheFile = `{
    "last_reminder": 0,
    "cached_at": 1588175266588,
    "signature": "${testCacheSignature}",
    "version": "2.0.0-beta.1",
    "output": {
      "product": "prisma",
      "current_version": "2.0.0-beta.3",
      "current_release_date": 1587479807,
      "current_download_url": "https://github.com/prisma/@prisma/cli",
      "install_command": "npm install -g @prisma/cli",
      "current_changelog_url": "https://github.com/prisma/@prisma/cli",
      "outdated": true,
      "project_website": "https://prisma.io",
      "alerts": []
    }
  }`;

  it('should return a consistent signature', async () => {
    const signature = await getSignature(testSignatureFile);
    expect(typeof signature).toEqual('string');
    expect(signature.length).toEqual(36);
  });

  it('should get the signature from signature file', async () => {
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile, testCacheFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
    expect(expectedSignature).toEqual(actualSignature);
  });

  it('should get the signature from signature file even if cache has signature', async () => {
    await writeFile$1(testCacheFile, testOldCacheFile);
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile, testCacheFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
    expect(expectedSignature).toEqual(actualSignature);
  });

  it('should migrate the signature to the signature file from cache and return the migrated signature', async () => {
    await writeFile$1(testCacheFile, testOldCacheFile);
    // 👇 Empty the signature file so that the signature is migrated
    await writeFile$1(testSignatureFile, '');
    let actualSignature = await getSignature(testSignatureFile, testCacheFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
    expect(testCacheSignature).toEqual(actualSignature);
  });

  it('should generate a new signature if the signature file has an invalid signature', async () => {
    const testInvalidSignature = 'asfsaf';
    await writeFile$1(testCacheFile, testInvalidSignature);
    await writeFile$1(testSignatureFile, testInvalidSignature);
    let actualSignature = await getSignature(testSignatureFile, testCacheFile);
    expect(typeof actualSignature).toEqual('string');
    expect(actualSignature.length).toEqual(36);
  });
});
