'use strict';

var paths = require('env-paths');
var path = require('path');
var fs = require('fs');
var util = require('util');
var writeFileFn = require('fast-write-atomic');
var uuid = require('uuid');
var makeDir = require('make-dir');
require('child_process');
require('os');
require('ms');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var paths__default = /*#__PURE__*/_interopDefaultLegacy(paths);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var writeFileFn__default = /*#__PURE__*/_interopDefaultLegacy(writeFileFn);
var makeDir__default = /*#__PURE__*/_interopDefaultLegacy(makeDir);

// Signature is a random signature that is stored and used

const exists = util.promisify(fs__default["default"].exists);
const readFile$1 = util.promisify(fs__default["default"].readFile);
const writeFile = util.promisify(writeFileFn__default["default"]);





// File identifier for the new global signature file
const PRISMA_SIGNATURE = 'signature';
const PRISMA_CACHE_FILE = 'prisma';

// IMPORTANT: this is part of the public API
async function getSignature(signatureFile, cacheFile) {
  const dirs = paths__default["default"](`checkpoint`);
  cacheFile = cacheFile || path__default["default"].join(dirs.cache, PRISMA_CACHE_FILE); // Old schema file
  signatureFile = signatureFile || path__default["default"].join(dirs.cache, PRISMA_SIGNATURE); // new file for signature

  if (await exists(signatureFile)) {
    // The signatureFile replaces cacheFile as the source of turth and therefore takes precedence
    const signature = await readSignature(signatureFile);
    if (signature) {
      return signature
    }
  }

  // Migration: There used to be a time when we stored the signature in the cacheFile.
  // If there is no signatureFile yet, but there is a signature in the cacheFile,
  // move said signature to the new signatureFile
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
    const data = await readFile$1(file, 'utf8');
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
  await makeDir__default["default"](path__default["default"].dirname(signatureFile));
  await writeFile(signatureFile, JSON.stringify(signatureState, null, '  '));
  return signatureState.signature
}

// imports

// promisify
util__default["default"].promisify(writeFileFn__default["default"]);
util__default["default"].promisify(fs__default["default"].readFile);
util__default["default"].promisify(fs__default["default"].unlink);

// JS-Checkpoint is a API-compatible JS client for a checkpoint server, like https://checkpoint.hashicorp.com/.

// Child path of the binary
// eval("__dirname") to make ncc happy
path__default["default"].join(eval('__dirname'), 'child');

const readdir = util__default["default"].promisify(fs__default["default"].readdir);
const readFile = util__default["default"].promisify(fs__default["default"].readFile);
const mkdir = util__default["default"].promisify(fs__default["default"].mkdir);







async function getInfo() {
  const cachePath = paths__default["default"]('checkpoint').cache;

  if (!fs__default["default"].existsSync(cachePath)) {
    await mkdir(cachePath, { recursive: true });
  }

  const dir = await readdir(cachePath);
  const cacheItems = [];

  for (const item of dir) {
    // Ignore signature and files without a -
    if (!item.includes('-')) {
      continue
    }

    try {
      const jsonData = JSON.parse(await readFile(path__default["default"].join(cachePath, item), { encoding: 'utf-8' }));
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

describe('signature', () => {
  it('should return an object', async () => {
    const info = await getInfo();

    expect(typeof info).toEqual('object');
    expect(Array.isArray(info.cacheItems)).toEqual(true);
    expect(typeof info.signature).toEqual('string');
    expect(typeof info.cachePath).toEqual('string');
  });
});
