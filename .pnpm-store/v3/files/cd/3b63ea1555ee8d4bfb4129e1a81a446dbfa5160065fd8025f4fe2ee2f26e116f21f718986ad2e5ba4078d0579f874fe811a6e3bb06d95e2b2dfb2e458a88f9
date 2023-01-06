'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var paths = _interopDefault(require('env-paths'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var util = require('util');
var util__default = _interopDefault(util);
var writeFileFn = _interopDefault(require('fast-write-atomic'));
var uuid = require('uuid');
var makeDir = _interopDefault(require('make-dir'));
require('cross-spawn');
require('@prisma/ci-info');
require('os');
require('ms');
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

// imports

// promisify
const writeFile$1 = util__default.promisify(writeFileFn);
const readFile$1 = util__default.promisify(fs.readFile);
const unlink = util__default.promisify(fs.unlink);

// JS-Checkpoint is a API-compatible JS client for a checkpoint server, like https://checkpoint.hashicorp.com/.

// Child path of the binary
// eval("__dirname") to make ncc happy
const childPath = path.join(eval('__dirname'), 'child');

const readdir = util__default.promisify(fs.readdir);
const readFile$2 = util__default.promisify(fs.readFile);







async function getInfo() {
  const cachePath = paths('checkpoint').cache;
  const dir = await readdir(cachePath);
  const cacheItems = [];

  for (const item of dir) {
    // Ignore signature and files without a -
    if (!item.includes('-')) {
      continue
    }

    try {
      const jsonData = JSON.parse(await readFile$2(path.join(cachePath, item), { encoding: 'utf-8' }));
      // add cli_path_hash for items that don't have it yet
      if (jsonData.output && !jsonData.output.cli_path_hash) {
        jsonData.output.cli_path_hash = item.split('-')[1];
      }
      cacheItems.push(jsonData);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    signature: await getSignature(),
    cachePath,
    cacheItems,
  }
}

describe('signature', async () => {
  it('should return an object', async () => {
    const info = await getInfo();

    assert.equal(typeof info, 'object');
    assert.equal(util.isArray(info.cacheItems), true);
    assert.equal(typeof info.signature, 'string');
    assert.equal(typeof info.cachePath, 'string');
  });
});
