'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var writeFileFn = _interopDefault(require('fast-write-atomic'));
var uuid = require('uuid');
var paths = _interopDefault(require('env-paths'));
var makeDir = _interopDefault(require('make-dir'));
var util = require('util');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var tempfile = _interopDefault(require('tempfile'));
var assert = _interopDefault(require('assert'));

// Signature is a random signature that is stored and used

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(writeFileFn);





// File identifier for the new global signature file
const PRISMA_SIGNATURE = 'signature';
const PRISMA_CACHE_FILE = 'prisma';

// IMPORTANT: this is part of the public API
async function getSignature(signatureFile, cacheFile) {
  const dirs = paths(`checkpoint`);
  cacheFile = cacheFile || path.join(dirs.cache, PRISMA_CACHE_FILE); // Old schema file
  signatureFile = signatureFile || path.join(dirs.cache, PRISMA_SIGNATURE); // new file for signature

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
  await makeDir(path.dirname(signatureFile));
  await writeFile(signatureFile, JSON.stringify(signatureState, null, '  '));
  return signatureState.signature
}

// Imports

const writeFile$1 = util.promisify(writeFileFn);

// Check tests
describe('signature', async () => {
  const testSignatureFile = tempfile();
  const testCacheFile = tempfile();
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
    assert.equal(typeof signature, 'string');
    assert.equal(signature.length, 36);
  });

  it('should get the signature from signature file', async () => {
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile, testCacheFile);
    assert.equal(typeof actualSignature, 'string');
    assert.equal(actualSignature.length, 36);
    assert.equal(expectedSignature, actualSignature);
  });

  it('should get the signature from signature file even if cache has signature', async () => {
    await writeFile$1(testCacheFile, testOldCacheFile);
    const expectedSignature = await createSignatureFile(testSignatureFile);
    const actualSignature = await getSignature(testSignatureFile, testCacheFile);
    assert.equal(typeof actualSignature, 'string');
    assert.equal(actualSignature.length, 36);
    assert.equal(expectedSignature, actualSignature);
  });

  it('should migrate the signature to the signature file from cache and return the migrated signature', async () => {
    await writeFile$1(testCacheFile, testOldCacheFile);
    // 👇 Empty the signature file so that the signature is migrated
    await writeFile$1(testSignatureFile, '');
    let actualSignature = await getSignature(testSignatureFile, testCacheFile);
    assert.equal(typeof actualSignature, 'string');
    assert.equal(actualSignature.length, 36);
    assert.equal(testCacheSignature, actualSignature);
  });

  it('should generate a new signature if the signature file has an invalid signature', async () => {
    const testInvalidSignature = 'asfsaf';
    await writeFile$1(testCacheFile, testInvalidSignature);
    await writeFile$1(testSignatureFile, testInvalidSignature);
    let actualSignature = await getSignature(testSignatureFile, testCacheFile);
    assert.equal(typeof actualSignature, 'string');
    assert.equal(actualSignature.length, 36);
  });
});
